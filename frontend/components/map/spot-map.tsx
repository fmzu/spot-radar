'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Circle, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { formatDistance } from '@/lib/format-distance';
import type { LatLng, Spot } from '@/lib/types';
import { SpotFocus } from './spot-focus';
import { MapCenterTracker } from './map-center-tracker';

// バンドラ経由だとLeaflet既定のマーカー画像パスが壊れるため、
// public/に配置した画像を直接参照する
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
});

type Props = {
  initialCenter: LatLng;
  center: LatLng;
  radiusKm: number;
  spots: Spot[];
  focusedSpot: Spot | null;
  onCenterChange: (center: LatLng) => void;
};

export default function SpotMap(props: Props) {
  return (
    <MapContainer
      center={[props.initialCenter.lat, props.initialCenter.lng]}
      zoom={14}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Circle
        center={[props.center.lat, props.center.lng]}
        radius={props.radiusKm * 1000}
        pathOptions={{ color: '#2563eb', weight: 2, fillOpacity: 0.08 }}
      />
      {props.spots.map((spot) => (
        <Marker key={spot.id} position={[spot.lat, spot.lng]}>
          <Popup>
            <div className="flex flex-col gap-1">
              <span className="font-bold">{spot.name}</span>
              <span className="text-xs text-gray-500">
                {spot.category} ・ {spot.address}
              </span>
              <span className="text-xs text-blue-600">
                中心から {formatDistance(spot.distanceM)}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
      <MapCenterTracker onCenterChange={props.onCenterChange} />
      <SpotFocus spot={props.focusedSpot} />
    </MapContainer>
  );
}
