import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from "./constants"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('v1');
  // setInterval(SaveTemporal, 1000*5) //Saves temporal highscores
  await app.listen(PORT);
}


bootstrap();
