import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { INestApplication, ValidationPipe } from '@nestjs/common';

export function setupApp(app: INestApplication) {
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://learnapp-frontend-prod.s3-website.eu-north-1.amazonaws.com',
      'https://dx01g0o1o4sy0.cloudfront.net'
    ],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
}
