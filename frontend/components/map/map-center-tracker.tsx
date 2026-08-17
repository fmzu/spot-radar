'use client';

import { useMapEvents } from 'react-leaflet';
import type { LatLng } from '@/lib/types';

type Props = {
  onCenterChange: (center: LatLng) => void;
};

/** 地図の移動が終わるたびに中心座標を親へ通知する */
export function MapCenterTracker(props: Props) {
  useMapEvents({
    moveend: (event) => {
      const center = event.target.getCenter();
      props.onCenterChange({ lat: center.lat, lng: center.lng });
    },
  });
  return null;
}
