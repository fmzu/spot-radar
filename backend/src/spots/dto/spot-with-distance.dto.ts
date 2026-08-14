/** GET /spots の応答に含まれるスポット */
export interface SpotWithDistanceDto {
  id: number;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  /** 検索中心からの距離（メートル） */
  distanceM: number;
}
