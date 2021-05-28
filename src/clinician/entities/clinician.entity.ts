import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  OneToMany,
  AfterLoad,
  getRepository,
} from 'typeorm';

import { Clinic } from '../../clinic/entities/clinic.entity';
import { Claim } from '../../claim/entities/claim.entity';
import { College } from './college.entity';
import { AbstractEntity } from '../../core/abstract.entity';
import { ClinicianDto } from '../dtos/clinician.dtos';
import { IsPhoneNumber } from 'class-validator';

@Entity('clinician')
export class Clinician extends AbstractEntity<ClinicianDto> {

  @ApiProperty()
  @Column({ nullable: true })
  licenseId: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty({ required: false })
  @Column({ default: null, nullable: true })
  middleName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column({ nullable: true })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ required: false })
  @Column({ default: null, nullable: true, type: 'varchar', length: 2 })
  collegeId: string;
  college: College;

  @ManyToMany(() => Clinic, (clinic) => clinic.clinicians)
  @JoinTable()
  clinics: Clinic[];

  @OneToMany(() => Claim, (claim) => claim.clinician)
  claims: Claim[];

  @AfterLoad()
  async afterLoad() {
    this.college = await getRepository(College).findOne({
      where: { id: this.collegeId },
    });
    delete this.collegeId;
  }
}
