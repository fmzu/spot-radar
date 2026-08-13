const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/** 逆ジオコーディングAPIを呼ぶ（座標→住所） */
export async function fetchAddress(
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<string> {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
  });
  const res = await fetch(`${API_BASE}/geocoding/reverse?${params}`, {
    signal,
  });
  if (!res.ok) {
    return '住所を取得できませんでした';
  }
  const data = await res.json();
  return data.address ?? '住所情報なし';
}
