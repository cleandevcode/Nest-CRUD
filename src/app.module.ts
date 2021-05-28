import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as OrmConfig from './orm.config';

import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { SeedModule } from './seed/seed.module';
import { ClinicModule } from './clinic/clinic.module';
import { ClinicianModule } from './clinician/clinician.module';
import { ProductModule } from './product/product.module';
import { ClaimModule } from './claim/claim.module';
import { InsurerModule } from './insurer/insurer.module';
import { ActionModule } from './action/action.module';
import { SearchModule } from './search/search.module';
import { AdjudicatorModule } from './adjudicator/adjudicator.module';
import { AdjudicationModule } from './adjudication/adjudication.module';
import { ClaimResponseModule } from './claim-response/claim-response.module';
import { ConditionModule } from './condition/condition.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(OrmConfig),
    UserModule,
    AuthModule,
    ClientModule,
    SeedModule,
    ClinicModule,
    ClinicianModule,
    ProductModule,
    ClaimModule,
    ConditionModule,
    InsurerModule,
    ActionModule,
    SearchModule,
    AdjudicatorModule,
    AdjudicationModule,
    ClaimResponseModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
