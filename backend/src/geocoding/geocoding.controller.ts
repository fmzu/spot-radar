import { Controller, Get, Query } from '@nestjs/common';
import { ReverseGeocodeQueryDto } from './dto/reverse-geocode-query.dto';
import { GeocodingService } from './geocoding.service';

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
