import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Client } from '../client/entities/client.entity';
import { ClientModule } from '../client/client.module';
import { ClientService } from '../client/client.service';
import { AdjudicationController } from './adjudication.controller';
import { AdjudicationService } from './adjudication.service';
import { GeneralInformation } from '../client/entities/general-information.entity';
import { InsuranceInformation } from '../client/entities/insurance-information.entity';
import { Adjudication } from './entities/adjudication.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Client,
      GeneralInformation,
      InsuranceInformation,
      Adjudication,
    ]),
    ClientModule,
  ],
  controllers: [AdjudicationController],
  providers: [AdjudicationService, ClientService],
})
export class AdjudicationModule {}
