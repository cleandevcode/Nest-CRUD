import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActionModule } from '../action/action.module';
import { Clinic } from './entities/clinic.entity';

import { ClinicController } from './clinic.controller';
import { ClinicService } from './clinic.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Clinic]),
    ActionModule
  ],
  controllers: [ClinicController],
  providers: [ClinicService]
})
export class ClinicModule {}
