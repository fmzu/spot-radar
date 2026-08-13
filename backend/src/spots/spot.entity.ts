import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/** GeoJSON形式のPoint（TypeORMがgeographyカラムとの変換を担う） */
export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat] の順（GeoJSONの規約）
}

@Entity('spots')
export class Spot {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  category!: string;

  @Column()
  address!: string;

  @Column('double precision')
  lat!: number;

  @Column('double precision')
  lng!: number;

  /**
   * 検索用の座標カラム。
   * - geography型: 緯度経度をそのまま扱え、距離計算がメートル単位になる
   * - GiST空間インデックス: 半径検索(ST_DWithin)を高速化する
   */
  @Index({ spatial: true })
  @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326 })
  location!: GeoPoint;
}
