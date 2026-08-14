import { Injectable, Logger } from '@nestjs/common';

interface CacheEntry {
  address: string;
  cachedAt: number;
}

/**
 * 座標から住所を取得する（逆ジオコーディング）。
 * Nominatim APIへのプロキシとして機能し、3つのコスト削減策を実装する:
 * 1. 座標の丸め: 約100m単位に丸めてキャッシュキーにする → わずかな移動ではAPIを叩かない
 * 2. インメモリキャッシュ: 同じ丸め座標への再問い合わせを防ぐ
 * 3. LRU風サイズ制限: キャッシュが上限を超えたら最古のエントリから削除する
 */
@Injectable()
export class GeocodingService {
  private readonly logger = new Logger(GeocodingService.name);
  private readonly cache = new Map<string, CacheEntry>();
  private readonly cacheTtlMs = 24 * 60 * 60 * 1000;
  /** キャッシュの最大エントリ数。地図操作で到達しうる地点数に対して十分な余裕 */
  private readonly cacheMaxSize = 500;

  async reverseGeocode(lat: number, lng: number): Promise<string> {
    const roundedLat = this.roundCoord(lat);
    const roundedLng = this.roundCoord(lng);
    const cacheKey = `${roundedLat},${roundedLng}`;

    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.cachedAt < this.cacheTtlMs) {
      return cached.address;
    }

    const address = await this.fetchFromNominatim(roundedLat, roundedLng);
    this.evictIfFull();
    this.cache.set(cacheKey, { address, cachedAt: Date.now() });
    this.logger.debug(`逆ジオ: (${roundedLat}, ${roundedLng}) → ${address}`);
    return address;
  }

  /** 座標を小数第3位に丸める（約100m単位。0.001度 ≈ 111m） */
  private roundCoord(value: number): number {
    return Math.round(value * 1000) / 1000;
  }

  /** キャッシュが上限に達していたら最古のエントリを削除する */
  private evictIfFull(): void {
    if (this.cache.size < this.cacheMaxSize) return;
    // Map は挿入順を保持するため、最初のキーが最古
    const oldestKey = this.cache.keys().next().value;
    if (oldestKey !== undefined) {
      this.cache.delete(oldestKey);
    }
  }

  /** Nominatim（OpenStreetMap）の逆ジオコーディングAPIを呼び出す */
  private async fetchFromNominatim(
    lat: number,
    lng: number,
  ): Promise<string> {
    const url =
      `https://nominatim.openstreetmap.org/reverse` +
      `?format=json&lat=${lat}&lon=${lng}&zoom=16&accept-language=ja`;
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'SpotRadar/1.0 (coding-test)' },
      });
      if (!res.ok) {
        this.logger.warn(`Nominatim API HTTP ${res.status}`);
        return '住所を取得できませんでした';
      }
      const data = await res.json();
      if (!data?.address) {
        return '住所情報なし';
      }
      const a = data.address;
      return [a.province, a.city, a.suburb, a.neighbourhood]
        .filter(Boolean)
        .join('');
    } catch (error) {
      this.logger.error('Nominatim API呼び出し失敗', error);
      return '住所を取得できませんでした';
    }
  }
}
