import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // クエリパラメータの検証と数値変換（DTOのデコレータに基づく）
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  // ブラウザ(localhost:3000)からAPI(localhost:3001)への呼び出しを許可する
  app.enableCors({ origin: ['http://localhost:3000'] });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
