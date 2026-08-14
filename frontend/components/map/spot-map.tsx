'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Circle, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { formatDistance } from '@/lib/format-distance';
import type { LatLng, Spot } from '@/lib/types';
import { FlyToSpot } from './fly-to-spot';
import { MapMoveHandler } from './map-move-handler';

// バンドラ経由だとLeaflet既定のマーカー画像パスが壊れるため、
// public/に配置した画像を直接参照する
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
});

interface Props {
  initialCenter: LatLng;
  center: LatLng;
  radiusKm: number;
  spots: Spot[];
  focusedSpot: Spot | null;
  onCenterChange: (center: LatLng) => void;
}

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
        pathOptions={{ color: '#2563eb', weight: 1, fillOpacity: 0.06 }}
      />
      {props.spots.map((spot) => (
        <Marker key={spot.id} position={[spot.lat, spot.lng]}>
          <Popup>
            <span className="font-bold">{spot.name}</span>
            <br />
            {spot.category} / {spot.address}
            <br />
            中心から {formatDistance(spot.distanceM)}
          </Popup>
        </Marker>
      ))}
      <MapMoveHandler onCenterChange={props.onCenterChange} />
      <FlyToSpot spot={props.focusedSpot} />
    </MapContainer>
  );
}
