'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import type { Spot } from '@/lib/types';

interface FlyToSpotProps {
  spot: Spot | null;
}

/** リストで選択されたスポットへ地図を移動する */
export function FlyToSpot({ spot }: FlyToSpotProps) {
  const map = useMap();

  useEffect(() => {
    if (spot) {
      map.flyTo([spot.lat, spot.lng], Math.max(map.getZoom(), 15));
    }
  }, [map, spot]);

  return null;
}
