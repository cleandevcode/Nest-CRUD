import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActionModule } from '../action/action.module';
import { Insurer } from './entities/insurer.entity';

import { InsurerController } from './insurer.controller';
import { InsurerService } from './insurer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Insurer]), ActionModule],
  controllers: [InsurerController],
  providers: [InsurerService],
})
export class InsurerModule {}
