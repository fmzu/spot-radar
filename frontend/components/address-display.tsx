'use client';

interface AddressDisplayProps {
  address: string | null;
  loading: boolean;
}

/** 地図中心の住所をヘッダーに表示する */
export function AddressDisplay({ address, loading }: AddressDisplayProps) {
  return (
    <span className="text-sm text-gray-600">
      📍{' '}
      {loading ? (
        <span className="text-gray-400">住所を取得中…</span>
      ) : (
        address ?? ''
      )}
    </span>
  );
}
