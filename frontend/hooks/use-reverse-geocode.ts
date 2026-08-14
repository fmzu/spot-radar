import { useEffect, useState } from 'react';
import { fetchAddress } from '@/lib/geocoding-api';

interface UseReverseGeocodeResult {
  address: string | null;
  loading: boolean;
}

/** debounce済みの中心座標から住所を取得する */
export function useReverseGeocode(
  lat: number,
  lng: number,
): UseReverseGeocodeResult {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetchAddress(lat, lng, controller.signal)
      .then(setAddress)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setAddress(null);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [lat, lng]);

  return { address, loading };
}
