import type { Spot } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/** 周辺スポット検索APIを呼ぶ（signalで進行中のリクエストを中断できる） */
export async function fetchSpots(
  lat: number,
  lng: number,
  radiusKm: number,
  signal?: AbortSignal,
): Promise<Spot[]> {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    radiusKm: String(radiusKm),
  });
  const res = await fetch(`${API_BASE}/spots?${params}`, { signal });
  if (!res.ok) {
    throw new Error(`スポット検索に失敗しました (HTTP ${res.status})`);
  }
  return res.json();
}
