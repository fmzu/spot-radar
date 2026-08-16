'use client';

import { formatDistance } from '@/lib/format-distance';
import type { Spot } from '@/lib/types';

interface Props {
  spots: Spot[];
  loading: boolean;
  error: string | null;
  focusedSpotId: number | null;
  onSelect: (spot: Spot) => void;
}

/** 検索結果のスポット一覧 */
export function SpotList(props: Props) {
  if (props.error) {
    return <p className="p-4 text-sm text-red-600">{props.error}</p>;
  }
  if (!props.loading && props.spots.length === 0) {
    return (
      <p className="p-4 text-sm text-gray-500">
        この範囲にスポットが見つかりませんでした。
        <br />
        半径を広げるか、地図を移動してみてください。
      </p>
    );
  }
  return (
    <ul className="divide-y divide-gray-100">
      {props.spots.map((spot) => (
        <li key={spot.id}>
          <button
            type="button"
            onClick={() => props.onSelect(spot)}
            className={`w-full cursor-pointer px-4 py-3 text-left transition-colors hover:bg-blue-50 ${
              spot.id === props.focusedSpotId ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-medium text-gray-900">{spot.name}</span>
              <span className="shrink-0 text-xs text-gray-400">
                {formatDistance(spot.distanceM)}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-blue-700">
                {spot.category}
              </span>
              <span>{spot.address}</span>
              <span className="ml-auto text-gray-300">›</span>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
