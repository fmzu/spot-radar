/** APIが返すスポット（検索中心からの距離付き） */
export interface Spot {
  id: number;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  /** 検索中心からの距離（メートル） */
  distanceM: number;
}

/** 地図の中心座標 */
export interface LatLng {
  lat: number;
  lng: number;
}
