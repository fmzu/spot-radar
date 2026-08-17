'use client';

type Props = {
  address: string | null;
  loading: boolean;
};

/** 地図中心の住所をヘッダーに表示する */
export function MapCenterAddress(props: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-blue-600">📍</span>
      <span className="text-base font-bold text-gray-900">
        {props.loading ? (
          <span className="font-normal text-gray-400">住所を取得中…</span>
        ) : (
          props.address ?? ''
        )}
      </span>
    </div>
  );
}
