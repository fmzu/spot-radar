import { useEffect, useState } from 'react';
import { fetchAddress } from '@/lib/geocoding-api';

type UseReverseGeocodeResult = {
  address: string | null;
  loading: boolean;
};

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
      .then((result) => {
        if (result instanceof Error) {
          setAddress(null);
        } else {
          setAddress(result);
        }
      })
      .catch(() => {
        // AbortErrorのみここに到達する
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [lat, lng]);

  return { address, loading };
}
