import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray } from 'class-validator';
import { AbstractDto } from '../../core/dtos/AbstractDto';

export class ConditionDto extends AbstractDto {

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  conditions: string[];
}
