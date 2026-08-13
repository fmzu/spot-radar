'use client';

import { useMapEvents } from 'react-leaflet';
import type { LatLng } from '@/lib/types';

interface MapMoveHandlerProps {
  onCenterChange: (center: LatLng) => void;
}

/** 地図の移動が終わるたびに中心座標を親へ通知する */
export function MapMoveHandler({ onCenterChange }: MapMoveHandlerProps) {
  useMapEvents({
    moveend: (event) => {
      const center = event.target.getCenter();
      onCenterChange({ lat: center.lat, lng: center.lng });
    },
  });
  return null;
}
