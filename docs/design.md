# 設計書

## アーキテクチャ

```
┌─────────────┐    ┌─────────────────┐    ┌──────────────────────┐
│  Frontend   │    │    Backend      │    │      Database         │
│  Next.js    │───▶│    NestJS       │───▶│  PostgreSQL + PostGIS │
│  :3000      │    │    :3001        │    │                      │
└─────────────┘    └────────┬────────┘    └──────────────────────┘
                            │
                   ┌────────▼────────┐
                   │   Nominatim     │
                   │  (逆ジオコーディング) │
                   └─────────────────┘
```

3層構成。全サービスを Docker Compose で管理し、`docker compose up` 一発で起動する。

## データベース設計

### spots テーブル

| カラム | 型 | 説明 |
|---|---|---|
| id | serial (PK) | 自動採番 |
| name | varchar | スポット名 |
| category | varchar | カテゴリ（飲食店・公園等） |
| address | varchar | 住所（シードCSVから取り込み） |
| lat | double precision | 緯度（API応答用に素の値を保持） |
| lng | double precision | 経度（API応答用に素の値を保持） |
| location | geography(Point, 4326) | 空間検索用。GiSTインデックス付き |

#### 設計判断

- **geography型 + GiSTインデックス**: 半径検索を `ST_DWithin` で行うために採用。距離計算がメートル単位で返り、インデックスにより全件スキャンを回避できる
- **lat/lng の併設**: location（geography型）とは別に素の緯度経度を保持する。API応答時に geography → 座標への逆変換を不要にするためのトレードオフ（正規化よりAPI応答の簡潔さを優先）

## API 設計

### `GET /spots` — 周辺スポット検索

指定した中心座標から半径 N km 以内のスポットを、近い順に返す。

| パラメータ | 型 | 必須 | 制約 | デフォルト |
|---|---|---|---|---|
| lat | number | ✓ | -90〜90 | — |
| lng | number | ✓ | -180〜180 | — |
| radiusKm | number | — | 0超〜20 | 3 |

**レスポンス**: `SpotWithDistanceDto[]`

```json
[
  {
    "id": 1,
    "name": "新宿中央公園",
    "category": "公園",
    "address": "東京都新宿区西新宿2丁目",
    "lat": 35.6905,
    "lng": 139.6895,
    "distanceM": 342
  }
]
```

**内部処理**: PostGIS の `ST_DWithin` で半径フィルタ → `ST_Distance` で距離計算 → 距離昇順ソート。

### `GET /geocoding/reverse` — 逆ジオコーディング

座標から住所を取得する。Nominatim API へのプロキシ。

| パラメータ | 型 | 必須 | 制約 |
|---|---|---|---|
| lat | number | ✓ | -90〜90 |
| lng | number | ✓ | -180〜180 |

**レスポンス**:

```json
{
  "address": "東京都新宿区西新宿"
}
```

**コスト削減策（二段構え）**:

1. **フロント側 debounce（400ms）**: 地図ドラッグ中はAPIを呼ばず、操作停止後に問い合わせ
2. **バックエンド側 座標丸めキャッシュ**: 緯度経度を小数第3位に丸めてキャッシュキーとする（0.001度 ≈ 約100m）。わずかな移動では同一キャッシュキーに収まり、API呼び出しをスキップ

## フロントエンド構成

```
app/
  page.tsx          ← メインページ（状態管理の中心）
components/
  map/
    spot-map.tsx    ← 地図本体（Leaflet）
    map-move-handler.tsx ← 地図移動イベントの検知
    fly-to-spot.tsx ← リスト選択時の地図移動
  spot-list.tsx     ← スポット一覧（地図と双方向連動）
  address-display.tsx ← 中心地点の住所表示
  search-radius-control.tsx ← 半径スライダー
hooks/
  use-spot-search.ts     ← 周辺検索APIの呼び出し
  use-reverse-geocode.ts ← 逆ジオコーディングの呼び出し
  use-debounced-value.ts ← debounceユーティリティ
lib/
  api.ts            ← APIクライアント
  api-base.ts       ← fetch共通処理
  geocoding-api.ts  ← 逆ジオコーディングAPIクライアント
  types.ts          ← 共有型定義
  format-distance.ts ← 距離のフォーマット
```

### 主要なデータフロー

1. ユーザーが地図を移動 → `MapMoveHandler` が中心座標を検知
2. 中心座標を debounce（400ms）してから2つのAPIを並行呼び出し:
   - `GET /spots` → スポット一覧を更新 → マーカーを再描画
   - `GET /geocoding/reverse` → 住所表示を更新
3. ユーザーがリスト内のスポットを選択 → `FlyToSpot` が地図を移動

## シードデータのインポート

- **タイミング**: NestJS の `OnApplicationBootstrap` フックでアプリ起動時に実行
- **冪等性**: テーブルにデータがあればスキップ（再起動で二重登録されない）
- **データ**: `seed/landit_coding_test_seed.csv`（199件）をDocker Volumeでマウント
