import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Clinician } from '../../clinician/entities/clinician.entity';
import { ColumnNumericTransformer } from '../../core/utils/typeorm.util';
import { AbstractEntity } from '../../core/abstract.entity';
import { ClinicDto } from '../dtos/clinic.dtos';

@Entity('clinic')
export class Clinic extends AbstractEntity<ClinicDto> {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  address: string;

  @ApiProperty({ required: false })
  @Column('numeric', {
    precision: 20,
    scale: 15,
    transformer: new ColumnNumericTransformer(),
    nullable: true,
    default: null,
  })
  latitude: number;

  @ApiProperty({ required: false })
  @Column('numeric', {
    precision: 20,
    scale: 15,
    transformer: new ColumnNumericTransformer(),
    nullable: true,
    default: null,
  })
  longitude: number;

  @ApiProperty()
  @Column()
  city: string;

  @ApiProperty()
  @Column()
  province: string;

  @ApiProperty()
  @Column()
  postalCode: string;

  @ManyToMany(() => Clinician, (clinician) => clinician.clinics)
  clinicians: Clinician[];
}
