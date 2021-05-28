import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Client } from './entities/client.entity';
import { GeneralInformation } from './entities/general-information.entity';
import { InsuranceInformation } from './entities/insurance-information.entity';

import { ConditionModule } from '../condition/condition.module';
import { ActionModule } from '../action/action.module';
import { UserModule } from '../user/user.module';

import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { InsuranceService } from './insurance.service';
import { InsurerModule } from 'src/insurer/insurer.module';
import { InsurerController } from 'src/insurer/insurer.controller';
import { InsurerService } from 'src/insurer/insurer.service';
import { Insurer } from 'src/insurer/entities/insurer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Client,
      GeneralInformation,
      InsuranceInformation,
      Insurer,
    ]),
    ConditionModule,
    ActionModule,
    UserModule,
    InsurerModule,
    ActionModule,
  ],
  controllers: [ClientController, InsurerController, InsurerController],
  providers: [ClientService, InsuranceService, InsurerService],
  exports: [ClientService, InsuranceService, InsurerService],
})
export class ClientModule {}
