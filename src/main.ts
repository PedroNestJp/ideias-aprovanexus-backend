import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: ['http://localhost:5173'],
      credentials: true,
    });
    app.setGlobalPrefix('/');
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads/',
    });
  } else {
    app.setGlobalPrefix('api');
    app.useStaticAssets(join('/var/www/inova-uploads'), {
      prefix: '/uploads/',
    });
  }
  await app.listen(3004);
}
bootstrap();
