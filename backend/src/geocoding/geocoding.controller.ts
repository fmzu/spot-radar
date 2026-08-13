import { Controller, Get, Query } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';
import { GeocodingService } from './geocoding.service';

class ReverseGeocodeQueryDto {
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng!: number;
}

@Controller('geocoding')
export class GeocodingController {
  constructor(private readonly geocodingService: GeocodingService) {}

  /** GET /geocoding/reverse?lat=35.68&lng=139.76 */
  @Get('reverse')
  async reverse(
    @Query() query: ReverseGeocodeQueryDto,
  ): Promise<{ address: string }> {
    const address = await this.geocodingService.reverseGeocode(
      query.lat,
      query.lng,
    );
    return { address };
  }
}
