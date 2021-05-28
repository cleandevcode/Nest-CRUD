import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { AbstractDto } from '../../core/dtos/AbstractDto';

export class ClinicianDto extends AbstractDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  licenseId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ required: true })
  @IsPhoneNumber()
  @IsString()
  phone: string;

  @ApiProperty({ type: String, pattern: '[0-9]{2}' })
  @IsString()
  @IsOptional()
  collegeId: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  clinics: string[];

  @ApiProperty({ type: String, required: false })
  @IsString()
  @Optional()
  reason?: string;
}
