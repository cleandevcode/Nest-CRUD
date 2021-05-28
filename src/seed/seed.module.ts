import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { ConditionModule } from '../condition/condition.module';

import { SeedService } from './seed.service';

@Module({
  imports: [
    UserModule,
    ConditionModule
  ],
  providers: [SeedService]
})
export class SeedModule {}
