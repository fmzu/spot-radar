import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spot } from './spot.entity';

export interface SpotWithDistance {
  id: number;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  /** 検索中心からの距離（メートル、四捨五入） */
  distanceM: number;
}

@Injectable()
export class SpotsService {
  constructor(
    @InjectRepository(Spot) private readonly spotRepository: Repository<Spot>,
  ) {}

  /**
   * 中心座標から半径radiusKm以内のスポットを近い順に返す。
   * ST_DWithin はGiST空間インデックスを利用でき、geography型なので単位はメートル。
   */
  async findNearby(
    lat: number,
    lng: number,
    radiusKm: number,
  ): Promise<SpotWithDistance[]> {
    const origin = 'ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography';
    const { entities, raw } = await this.spotRepository
      .createQueryBuilder('spot')
      .addSelect(`ST_Distance(spot.location, ${origin})`, 'distance_m')
      .where(`ST_DWithin(spot.location, ${origin}, :meters)`)
      .orderBy('distance_m', 'ASC')
      .setParameters({ lat, lng, meters: radiusKm * 1000 })
      .getRawAndEntities();

    return entities.map((spot, i) => ({
      id: spot.id,
      name: spot.name,
      category: spot.category,
      address: spot.address,
      lat: spot.lat,
      lng: spot.lng,
      distanceM: Math.round(Number(raw[i].distance_m)),
    }));
  }
}
