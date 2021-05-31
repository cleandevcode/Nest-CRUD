import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as DotEnv from 'dotenv';

import { AppModule } from './app.module';

async function bootstrap() {
  DotEnv.config();
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('This documentation is for Student Management App')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  app.enableCors({ origin: '*' });
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap().then();
