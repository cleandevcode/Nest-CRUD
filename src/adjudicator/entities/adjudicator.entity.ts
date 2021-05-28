import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString, validate } from 'class-validator';
import {
  Entity,
  Column
} from 'typeorm';

import { AbstractEntity } from '../../core/abstract.entity';
import { AdjudicatorDto } from '../dtos/adjudicator.dto';

@Entity('adjudicator')
export class Adjudicator extends AbstractEntity<AdjudicatorDto> {
  @ApiProperty()
  @IsNumberString()
  @Column({ 
    type: 'varchar',
    length: 6,
    name: 'iin_number',
    unique: true,
  })
  iinNumber: string

  @ApiProperty()
  @IsString()
  @Column({ 
    type: 'varchar',
  })
  name: string
}
