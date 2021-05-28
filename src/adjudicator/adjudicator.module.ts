import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Adjudicator } from './entities/adjudicator.entity';

import { AdjudicatorController } from './adjudicator.controller';
import { AdjudicatorService } from './adjudicator.service';
import { ActionModule } from '../action/action.module';

@Module({
  imports: [TypeOrmModule.forFeature([Adjudicator]), ActionModule],
  controllers: [AdjudicatorController],
  providers: [AdjudicatorService],
  exports: [AdjudicatorService],
})
export class AdjudicatorModule {}
