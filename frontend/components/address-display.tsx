'use client';

interface Props {
  address: string | null;
  loading: boolean;
}

/** 地図中心の住所をヘッダーに表示する */
export function AddressDisplay(props: Props) {
  return (
    <span className="text-sm text-gray-600">
      📍{' '}
      {props.loading ? (
        <span className="text-gray-400">住所を取得中…</span>
      ) : (
        props.address ?? ''
      )}
    </span>
  );
}
