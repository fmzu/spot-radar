'use client';

interface RadiusSliderProps {
  radiusKm: number;
  onChange: (radiusKm: number) => void;
}

/** 検索半径（km）を動的に変更するスライダー */
export function RadiusSlider({ radiusKm, onChange }: RadiusSliderProps) {
  return (
    <label className="flex items-center gap-3 text-sm text-gray-700">
      <span className="shrink-0">
        半径 <span className="inline-block w-12 font-bold">{radiusKm}km</span>
      </span>
      <input
        type="range"
        min={0.5}
        max={20}
        step={0.5}
        value={radiusKm}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-blue-600"
      />
    </label>
  );
}
