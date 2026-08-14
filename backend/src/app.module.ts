import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { GeocodingModule } from './geocoding/geocoding.module';
import { SpotsModule } from './spots/spots.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'app',
      password: process.env.DB_PASSWORD ?? 'app',
      database: process.env.DB_NAME ?? 'spots',
      autoLoadEntities: true,
      // デモ規模のためEntity定義から自動でテーブル作成する。実運用ではマイグレーション管理に切り替える
      synchronize: true,
    }),
    SpotsModule,
    GeocodingModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
