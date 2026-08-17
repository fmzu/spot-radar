'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { MapCenterAddress } from '@/components/map-center-address';
import { SearchRadiusControl } from '@/components/search-radius-control';
import { SpotList } from '@/components/spot-list';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useReverseGeocode } from '@/hooks/use-reverse-geocode';
import { useSpotSearch } from '@/hooks/use-spot-search';
import type { LatLng, Spot } from '@/lib/types';

const SpotMap = dynamic(() => import('@/components/map/spot-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-gray-400">
      地図を読み込み中…
    </div>
  ),
});

const INITIAL_CENTER: LatLng = { lat: 35.6812, lng: 139.7671 };
const INITIAL_RADIUS_KM = 3;

export default function Home() {
  const [center, setCenter] = useState<LatLng>(INITIAL_CENTER);
  const [radiusKm, setRadiusKm] = useState(INITIAL_RADIUS_KM);
  const [focusedSpot, setFocusedSpot] = useState<Spot | null>(null);

  const debouncedCenter = useDebouncedValue(center, 400);
  const debouncedRadiusKm = useDebouncedValue(radiusKm, 300);

  const { spots, loading, error } = useSpotSearch(
    debouncedCenter.lat,
    debouncedCenter.lng,
    debouncedRadiusKm,
  );
  const { address, loading: addressLoading } = useReverseGeocode(
    debouncedCenter.lat,
    debouncedCenter.lng,
  );

  return (
    <main className="flex h-dvh flex-col">
      <header className="border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <MapCenterAddress address={address} loading={addressLoading} />
      </header>
      <div className="flex min-h-0 flex-1">
        <div className="map-crosshair relative min-w-0 flex-1">
          <SpotMap
            initialCenter={INITIAL_CENTER}
            center={debouncedCenter}
            radiusKm={radiusKm}
            spots={spots}
            focusedSpot={focusedSpot}
            onCenterChange={setCenter}
          />
          <div className="absolute bottom-4 left-4 z-[1000]">
            <SearchRadiusControl radiusKm={radiusKm} onChange={setRadiusKm} />
          </div>
        </div>
        <aside
          className="flex w-80 shrink-0 flex-col border-l border-gray-200 bg-white"
          aria-label="検索結果"
        >
          <div className="border-b border-gray-100 px-4 py-2.5">
            <span className="text-sm font-medium text-gray-700">
              周辺の観光スポット
            </span>
            <span className="ml-2 text-sm text-gray-400" aria-live="polite">
              {loading ? '検索中…' : `${spots.length}件`}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <SpotList
              spots={spots}
              loading={loading}
              error={error}
              focusedSpotId={focusedSpot?.id ?? null}
              onSelect={setFocusedSpot}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}
