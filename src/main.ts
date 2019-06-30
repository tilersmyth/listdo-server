import { NestFactory } from '@nestjs/core';
import * as Store from 'connect-redis';
import * as session from 'express-session';

import { redis } from './redis';
import { AppModule } from './app.module';
import { express } from './express';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  const RedisStore = Store(session);

  const store = new RedisStore({
    client: redis as any,
  });

  app.use(express(store));

  await app.listen(3000);
};
bootstrap();
