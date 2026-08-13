import { readFileSync } from 'node:fs';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parse } from 'csv-parse/sync';
import { Repository } from 'typeorm';
import { Spot } from './spot.entity';

interface SeedRow {
  name: string;
  category: string;
  lat: string;
  long: string;
  address: string;
}

/**
 * アプリ起動時にシードCSVをDBへ自動インポートする。
 * テーブルに既にデータがあれば何もしない（冪等: 再起動しても二重登録されない）。
 */
@Injectable()
export class SpotsSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SpotsSeederService.name);

  constructor(
    @InjectRepository(Spot) private readonly spotRepository: Repository<Spot>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const count = await this.spotRepository.count();
    if (count > 0) {
      this.logger.log(`シード済み（${count}件）のためインポートをスキップ`);
      return;
    }

    const seedFile =
      process.env.SEED_FILE ?? '../seed/landit_coding_test_seed.csv';
    const rows: SeedRow[] = parse(readFileSync(seedFile, 'utf8'), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const spots = rows.map((row) =>
      this.spotRepository.create({
        name: row.name,
        category: row.category,
        address: row.address,
        lat: Number(row.lat),
        lng: Number(row.long),
        location: {
          type: 'Point',
          coordinates: [Number(row.long), Number(row.lat)],
        },
      }),
    );
    await this.spotRepository.save(spots, { chunk: 100 });
    this.logger.log(`シードCSVから${spots.length}件をインポートしました`);
  }
}
