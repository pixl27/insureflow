import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = 4003;
  await app.listen(port);
  console.log(`CONTRACTS service running on: http://localhost:${port}`);
}
bootstrap();
