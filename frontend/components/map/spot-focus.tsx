'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import type { Spot } from '@/lib/types';

type Props = {
  spot: Spot | null;
};

/** リストで選択されたスポットへ地図を移動する */
export function SpotFocus(props: Props) {
  const map = useMap();

  useEffect(() => {
    if (props.spot) {
      map.flyTo([props.spot.lat, props.spot.lng], Math.max(map.getZoom(), 15));
    }
  }, [map, props.spot]);

  return null;
}
