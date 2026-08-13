'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { AddressDisplay } from '@/components/address-display';
import { RadiusSlider } from '@/components/radius-slider';
import { SpotList } from '@/components/spot-list';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { fetchSpots } from '@/lib/api';
import { fetchAddress } from '@/lib/geocoding-api';
import type { LatLng, Spot } from '@/lib/types';

// Leafletはブラウザ専用のためサーバーサイドレンダリングを無効化する
const SpotMap = dynamic(() => import('@/components/map/spot-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-gray-400">
      地図を読み込み中…
    </div>
  ),
});

/** 初期表示は東京駅周辺 */
const INITIAL_CENTER: LatLng = { lat: 35.6812, lng: 139.7671 };
const INITIAL_RADIUS_KM = 3;

export default function Home() {
  const [center, setCenter] = useState<LatLng>(INITIAL_CENTER);
  const [radiusKm, setRadiusKm] = useState(INITIAL_RADIUS_KM);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [focusedSpot, setFocusedSpot] = useState<Spot | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  // 地図移動・スライダー操作が止まってから検索する
  const debouncedCenter = useDebouncedValue(center, 400);
  const debouncedRadiusKm = useDebouncedValue(radiusKm, 300);

  // 周辺スポット検索
  useEffect(() => {
    const controller = new AbortController();
    let aborted = false;
    setLoading(true);
    fetchSpots(
      debouncedCenter.lat,
      debouncedCenter.lng,
      debouncedRadiusKm,
      controller.signal,
    )
      .then((result) => {
        setSpots(result);
        setError(null);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          aborted = true;
          return;
        }
        setError('スポットの検索に失敗しました。');
      })
      .finally(() => {
        if (!aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [debouncedCenter.lat, debouncedCenter.lng, debouncedRadiusKm]);

  // 逆ジオコーディング（地図中心の住所取得）
  useEffect(() => {
    const controller = new AbortController();
    setAddressLoading(true);
    fetchAddress(debouncedCenter.lat, debouncedCenter.lng, controller.signal)
      .then(setAddress)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setAddress(null);
      })
      .finally(() => setAddressLoading(false));
    return () => controller.abort();
  }, [debouncedCenter.lat, debouncedCenter.lng]);

  return (
    <main className="flex h-dvh flex-col">
      <header className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-gray-200 bg-white px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">スポット周辺検索</h1>
        <div className="w-64">
          <RadiusSlider radiusKm={radiusKm} onChange={setRadiusKm} />
        </div>
        <span className="text-sm text-gray-500">
          {loading ? '検索中…' : `${spots.length}件`}
        </span>
        <AddressDisplay address={address} loading={addressLoading} />
      </header>
      <div className="flex min-h-0 flex-1">
        <div className="relative min-w-0 flex-1">
          <SpotMap
            initialCenter={INITIAL_CENTER}
            center={debouncedCenter}
            radiusKm={radiusKm}
            spots={spots}
            focusedSpot={focusedSpot}
            onCenterChange={setCenter}
          />
        </div>
        <aside className="w-80 shrink-0 overflow-y-auto border-l border-gray-200 bg-white">
          <SpotList
            spots={spots}
            loading={loading}
            error={error}
            focusedSpotId={focusedSpot?.id ?? null}
            onSelect={setFocusedSpot}
          />
        </aside>
      </div>
    </main>
  );
}
