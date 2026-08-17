import { API_BASE } from './api-base';

/** 逆ジオコーディングAPIを呼ぶ（座標→住所） */
export async function fetchAddress(
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<string | Error> {
  try {
    const params = new URLSearchParams({
      lat: String(lat),
      lng: String(lng),
    });
    const res = await fetch(`${API_BASE}/geocoding/reverse?${params}`, {
      signal,
    });
    if (!res.ok) {
      return new Error('住所を取得できませんでした');
    }
    const data = await res.json();
    return data.address ?? '住所情報なし';
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    return new Error('住所を取得できませんでした');
  }
}
