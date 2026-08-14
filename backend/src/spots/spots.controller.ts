import { Controller, Get, Query } from '@nestjs/common';
import { FindSpotsQueryDto } from './dto/find-spots-query.dto';
import { SpotWithDistanceDto } from './dto/spot-with-distance.dto';
import { SpotsService } from './spots.service';

@Controller('spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  /** 周辺スポット検索: GET /spots?lat=35.65&lng=139.74&radiusKm=3 */
  @Get()
  find(@Query() query: FindSpotsQueryDto): Promise<SpotWithDistanceDto[]> {
    return this.spotsService.findNearby(query.lat, query.lng, query.radiusKm);
  }
}
