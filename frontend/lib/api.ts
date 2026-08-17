import { API_BASE } from './api-base';
import type { Spot } from './types';

/** 周辺スポット検索APIを呼ぶ */
export async function fetchSpots(
  lat: number,
  lng: number,
  radiusKm: number,
  signal?: AbortSignal,
): Promise<Spot[] | Error> {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    radiusKm: String(radiusKm),
  });
  try {
    const res = await fetch(`${API_BASE}/spots?${params}`, { signal });
    if (!res.ok) {
      return new Error(`スポット検索に失敗しました (HTTP ${res.status})`);
    }
    return res.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    return new Error('スポットの検索に失敗しました。');
  }
}
