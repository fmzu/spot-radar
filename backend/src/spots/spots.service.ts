import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpotWithDistanceDto } from './dto/spot-with-distance.dto';
import { Spot } from './spot.entity';

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
  ): Promise<SpotWithDistanceDto[]> {
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
