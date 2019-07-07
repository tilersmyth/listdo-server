import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { sessionConfig } from './sessionConfig';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.use(sessionConfig());

  await app.listen(3000);
};
bootstrap();
