import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Client } from './client.entity';
import { Gender } from '../../core/enums/base';
import { ColumnNumericTransformer } from '../../core/utils/typeorm.util';
import { AbstractEntity } from '../../core/abstract.entity';

@Entity('client_general_information')
export class GeneralInformation extends AbstractEntity {
  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty({ required: false })
  @Column({ default: null, nullable: true })
  middleName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty({ enum: Gender })
  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @ApiProperty()
  @Column()
  birthday: Date;

  @ApiProperty()
  @Column()
  addressLine1: string;

  @ApiProperty({ required: false })
  @Column({ default: null, nullable: true })
  addressLine2: string;

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
  postalCode: string;

  @ApiProperty()
  @Column()
  city: string;

  @ApiProperty()
  @Column()
  province: string;

  @ApiProperty()
  @Column()
  phoneNumber: string;

  @ApiProperty()
  @Column()
  mobileNumber: string;

  @ApiProperty()
  @Column()
  email: string;

  @OneToOne(() => Client, (client) => client.generalInfo)
  @JoinColumn()
  client: Client;
}
