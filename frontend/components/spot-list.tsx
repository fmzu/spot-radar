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

/** 検索結果のスポット一覧（クリックで地図が該当地点へ移動する） */
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
            className={`w-full px-4 py-3 text-left transition-colors hover:bg-blue-50 ${
              spot.id === props.focusedSpotId ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-medium text-gray-900">{spot.name}</span>
              <span className="shrink-0 text-xs text-gray-500">
                {formatDistance(spot.distanceM)}
              </span>
            </div>
            <div className="mt-0.5 text-xs text-gray-500">
              <span className="mr-2 rounded bg-gray-100 px-1.5 py-0.5">
                {spot.category}
              </span>
              {spot.address}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
