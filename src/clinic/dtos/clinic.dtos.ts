import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { AbstractDto } from '../../core/dtos/AbstractDto';

export class ClinicDto extends AbstractDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  province: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @Optional()
  reason?: string

}
