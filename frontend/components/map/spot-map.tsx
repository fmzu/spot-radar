'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { Circle, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { formatDistance } from '@/lib/format-distance';
import type { LatLng, Spot } from '@/lib/types';
import { FlyToSpot } from './fly-to-spot';
import { MapMoveHandler } from './map-move-handler';

// バンドラ経由だとLeaflet既定のマーカー画像パスが壊れるため明示設定する
// （既定のURL解決関数が残っていると設定が無視されるため先に削除する）
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: iconUrl.src,
  iconRetinaUrl: iconRetinaUrl.src,
  shadowUrl: shadowUrl.src,
});

interface SpotMapProps {
  initialCenter: LatLng;
  center: LatLng;
  radiusKm: number;
  spots: Spot[];
  focusedSpot: Spot | null;
  onCenterChange: (center: LatLng) => void;
}

export default function SpotMap({
  initialCenter,
  center,
  radiusKm,
  spots,
  focusedSpot,
  onCenterChange,
}: SpotMapProps) {
  return (
    <MapContainer
      center={[initialCenter.lat, initialCenter.lng]}
      zoom={14}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* 検索範囲の可視化（中心＝最後に検索した地点、半径＝スライダー値） */}
      <Circle
        center={[center.lat, center.lng]}
        radius={radiusKm * 1000}
        pathOptions={{ color: '#2563eb', weight: 1, fillOpacity: 0.06 }}
      />
      {spots.map((spot) => (
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
      <MapMoveHandler onCenterChange={onCenterChange} />
      <FlyToSpot spot={focusedSpot} />
    </MapContainer>
  );
}
