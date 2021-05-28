import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

import { AbstractDto } from '../../core/dtos/AbstractDto';

export class AdjudicatorDto extends AbstractDto {
  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  iinNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class AdjudicatorContentDto {
  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  iinNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @Optional()
  reason?: string;
}
