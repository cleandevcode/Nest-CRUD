import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActionModule } from '../action/action.module';

import { Clinician } from './entities/clinician.entity';
import { Clinic } from '../clinic/entities/clinic.entity';
import { College } from './entities/college.entity';

import { ClinicianService } from './clinician.service';
import { CollegeService } from './college.service';
import { ClinicianController, CollegeController } from './clinician.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Clinician, Clinic, College]),
    ActionModule,
  ],
  providers: [ClinicianService, CollegeService],
  controllers: [ClinicianController, CollegeController],
  exports: [ClinicianService],
})
export class ClinicianModule {}
