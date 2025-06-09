import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './bootstrap-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupApp(app);
  
  await app.listen(3001);
}
bootstrap();
