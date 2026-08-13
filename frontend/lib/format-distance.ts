/** メートルを読みやすい表記にする（980 → "980m"、1240 → "1.2km"） */
export function formatDistance(meters: number): string {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${meters}m`;
}
