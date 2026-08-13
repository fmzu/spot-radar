import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spot } from './spot.entity';
import { SpotsController } from './spots.controller';
import { SpotsSeederService } from './spots-seeder.service';
import { SpotsService } from './spots.service';

@Module({
  imports: [TypeOrmModule.forFeature([Spot])],
  controllers: [SpotsController],
  providers: [SpotsService, SpotsSeederService],
})
export class SpotsModule {}
