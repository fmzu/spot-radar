import { useEffect, useState } from 'react';
import { fetchSpots } from '@/lib/api';
import type { Spot } from '@/lib/types';

interface UseSpotSearchResult {
  spots: Spot[];
  loading: boolean;
  error: string | null;
}

/** debounce済みの中心座標と半径で周辺スポットを検索する */
export function useSpotSearch(
  lat: number,
  lng: number,
  radiusKm: number,
): UseSpotSearchResult {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let aborted = false;
    setLoading(true);
    fetchSpots(lat, lng, radiusKm, controller.signal)
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
  }, [lat, lng, radiusKm]);

  return { spots, loading, error };
}
