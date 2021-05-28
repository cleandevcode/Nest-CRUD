import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionModule } from 'src/action/action.module';
import { ClaimModule } from 'src/claim/claim.module';
import { ClientModule } from 'src/client/client.module';
import { ClinicianModule } from 'src/clinician/clinician.module';
import { UserModule } from 'src/user/user.module';
import { ClaimResponseController } from './claim-response.controller';
import { ClaimResponseService } from './claim-response.service';
import { ClaimResponseOrder } from './entities/claim-response-order.entity';
import { ClaimResponseRequest } from './entities/claim-response-request.entity';
import { ClaimResponseResponse } from './entities/claim-response-response.entity';
import { ClaimResponse } from './entities/claimResponse.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClaimResponse,
      ClaimResponseResponse,
      ClaimResponseOrder,
      ClaimResponseRequest,
    ]),
    ActionModule,
    UserModule,
    ClientModule,
    ClaimModule,
    ClinicianModule,
  ],
  controllers: [ClaimResponseController],
  providers: [ClaimResponseService],
  exports: [ClaimResponseService],
})
export class ClaimResponseModule {}
