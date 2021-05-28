import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActionModule } from '../action/action.module';

import { Claim } from './entities/claim.entity';
import { Cart } from './entities/cart.entity';
import { User } from '../user/entities/user.entity';
import { Client } from '../client/entities/client.entity';
import { Clinician } from '../clinician/entities/clinician.entity';
import { ClaimRequestType } from './entities/requestType.entity';

import { ClaimController } from './claim.controller';
import { ClaimService } from './claim.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Claim,
      Cart,
      User,
      Client,
      Clinician,
      ClaimRequestType,
    ]),
    ActionModule,
  ],
  controllers: [ClaimController],
  providers: [ClaimService],
  exports: [ClaimService],
})
export class ClaimModule {}
