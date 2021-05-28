import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Condition } from './entities/condition.entity';

import { ConditionService } from './condition.service';
import { ConditionController } from './condition.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Condition])
  ],
  providers: [ConditionService],
  exports: [ConditionService],
  controllers: [ConditionController]
})
export class ConditionModule {}
