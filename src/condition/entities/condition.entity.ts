import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { AbstractEntity } from '../../core/abstract.entity';
import { ConditionDto } from '../dtos/condition.dto';

@Entity('condition')
export class Condition extends AbstractEntity<ConditionDto> {

  @ApiProperty({type: String, isArray: true})
  @Column({type: 'simple-array', default: []})
  conditions: string[];

}
