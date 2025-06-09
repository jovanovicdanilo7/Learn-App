import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Callback, Context, Handler } from 'aws-lambda';
import * as express from 'express';
import { setupApp } from './bootstrap-app';
const cors = require('cors');
const serverlessExpress = require('@vendia/serverless-express');

let cachedServer: Handler;

async function bootstrapServer(): Promise<Handler> {
  const app = express();
  app.use(cors({
    origin: [
      'http://localhost:3000',
      'http://learnapp-frontend-prod.s3-website.eu-north-1.amazonaws.com',
      'https://cloudfront-url.com'
    ],
    credentials: true,
  }));

  const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(app));
  setupApp(nestApp);

  await nestApp.init();

  return serverlessExpress({ app });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  cachedServer = cachedServer ?? (await bootstrapServer());
  return cachedServer(event, context, callback);
};
