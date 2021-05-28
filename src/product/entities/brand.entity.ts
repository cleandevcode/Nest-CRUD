import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../core/abstract.entity';
import { IsString } from 'class-validator';
import { AbstractDto } from 'src/core/dtos/AbstractDto';

@Entity('brand')
export class Brand extends AbstractEntity<AbstractDto> {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @Column({ type: 'varchar', unique: true })
  name: string;
}
