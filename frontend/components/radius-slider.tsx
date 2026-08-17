'use client';

type Props = {
  radiusKm: number;
  onChange: (radiusKm: number) => void;
};

/** 検索半径（km）を動的に変更するスライダー（地図上にオーバーレイ表示） */
export function RadiusSlider(props: Props) {
  return (
    <div className="rounded-lg bg-white/90 px-3 py-2 shadow-md backdrop-blur-sm">
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <span className="shrink-0">半径</span>
        <input
          type="range"
          min={0.5}
          max={20}
          step={0.5}
          value={props.radiusKm}
          onChange={(event) => props.onChange(Number(event.target.value))}
          className="w-32 accent-blue-600"
        />
        <span className="w-14 shrink-0 text-right text-base font-bold text-gray-900">
          {props.radiusKm}km
        </span>
      </label>
    </div>
  );
}
