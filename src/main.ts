import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: ['http://localhost:5173'],
      credentials: true,
    });
    app.setGlobalPrefix('/');
  } else {
    app.setGlobalPrefix('api');
  }
  await app.listen(3004);
}
bootstrap();
