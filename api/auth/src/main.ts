import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = 4001;
  await app.listen(port);
  console.log(`AUTH service running on: http://localhost:${port}`);
}
bootstrap();
