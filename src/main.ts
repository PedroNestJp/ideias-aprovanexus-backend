import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: ['http://localhost:5173'],
      credentials: true,
    });
  }

  await app.listen(3004);
}
bootstrap();
