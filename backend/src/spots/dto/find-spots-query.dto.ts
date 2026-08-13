import { Type } from 'class-transformer';
import { IsNumber, IsPositive, Max, Min } from 'class-validator';

/** GET /spots のクエリパラメータ（検証と型変換はValidationPipeが行う） */
export class FindSpotsQueryDto {
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

  /** 検索半径（km）。UIのスライダー上限に合わせて最大50km */
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Max(50)
  radiusKm: number = 3;
}
