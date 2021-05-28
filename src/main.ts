import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as DotEnv from 'dotenv';

import { SeedService } from './seed/seed.service';

import { AppModule } from './app.module';

async function bootstrap() {
  DotEnv.config();
  const app = await NestFactory.create(AppModule);
  const seedService = app.get<SeedService>(SeedService);
  await seedService.seedAdminUser();
  const options = new DocumentBuilder()
    .setTitle('GojiRx API Documentation')
    .setDescription('This documentation is for GojiRx')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  app.enableCors({ origin: '*' });
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);
  await app.listen(process.env.PORT || 8085);
}
bootstrap().then();
