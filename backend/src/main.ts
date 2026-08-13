import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ブラウザ(localhost:3000)からAPI(localhost:3001)への呼び出しを許可する
  app.enableCors({ origin: true });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
