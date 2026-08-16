'use client';

interface Props {
  radiusKm: number;
  onChange: (radiusKm: number) => void;
}

/** 検索半径（km）を動的に変更するスライダー */
export function RadiusSlider(props: Props) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600">
      <span className="shrink-0">半径</span>
      <input
        type="range"
        min={0.5}
        max={20}
        step={0.5}
        value={props.radiusKm}
        onChange={(event) => props.onChange(Number(event.target.value))}
        className="w-full accent-blue-600"
      />
      <span className="w-14 shrink-0 text-right text-base font-bold text-gray-900">
        {props.radiusKm}km
      </span>
    </label>
  );
}
