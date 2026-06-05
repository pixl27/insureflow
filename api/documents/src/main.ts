import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = 4006;
  await app.listen(port);
  console.log(`DOCUMENTS service running on: http://localhost:${port}`);
}
bootstrap();
