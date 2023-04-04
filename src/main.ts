import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {join} from "path";
import {NestExpressApplication} from "@nestjs/platform-express";
import {useContainer} from "class-validator";
import {startDaemonTemporalHiscores} from "./temporal_hiscores/temporal_daemon";

let PORT = 8443
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // httpsOptions: {
    //   key: fs.readFileSync(config.KEY_PATH),
    //   cert: fs.readFileSync(config.CERT_PATH)
    // }
  });
  app.enableCors();
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', 'public'), {//http://localhost:8443/public/ge-icons/2.png
    index: false,
    prefix: '/public',
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  startDaemonTemporalHiscores(PORT)

  await app.listen(PORT);
}
bootstrap();
