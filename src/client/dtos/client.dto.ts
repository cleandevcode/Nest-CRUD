import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
  ValidateNested,
  IsEmail,
  IsNumber,
  IsNumberString,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Gender } from '../../core/enums/base';
import { AbstractDto } from '../../core/dtos/AbstractDto';
import { Insurer } from 'src/insurer/entities/insurer.entity';
import { InsuranceInformation } from '../entities/insurance-information.entity';

export class GeneralInformationDto {
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

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsDate()
  birthday: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  addressLine2?: string;

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
  postalCode: string;

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
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mobileNumber: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @Optional()
  reason?: string;
}

export class InsuranceInformationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNumberString()
  carrierId: string;

  @ApiProperty()
  @IsString()
  @IsNumberString()
  adjudicator: string;

  @ApiProperty()
  @IsString()
  @IsNumberString()
  insurerId: string;

  @ApiProperty()
  @IsString()
  groupNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty()
  @IsString()
  patientCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cardholderIdentity: string;

  @ApiProperty()
  @IsOptional()
  relationship: string;

  @ApiProperty()
  insurer: Insurer;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @Optional()
  reason?: string;
}

export class InsuranceDto {
  @ApiProperty({ type: () => InsuranceInformationDto })
  @Type(() => InsuranceInformationDto)
  @ValidateNested({ each: true })
  primaryInsuranceInfo: InsuranceInformationDto;

  @ApiProperty({ type: () => InsuranceInformationDto })
  @Type(() => InsuranceInformationDto)
  @ValidateNested({ each: true })
  secondaryInsuranceInfo: InsuranceInformationDto;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @Optional()
  reason?: string;
}

export class Insurance {
  @ApiProperty({ type: () => InsuranceInformation })
  @Type(() => InsuranceInformation)
  @ValidateNested({ each: true })
  primaryInsuranceInfo: InsuranceInformation;

  @ApiProperty({ type: () => InsuranceInformation })
  @Type(() => InsuranceInformation)
  @ValidateNested({ each: true })
  secondaryInsuranceInfo: InsuranceInformation;
}

export class ClientDto extends AbstractDto {
  @ApiProperty({ type: () => GeneralInformationDto })
  @Type(() => GeneralInformationDto)
  @ValidateNested({ each: true })
  generalInfo: GeneralInformationDto;

  @ApiProperty({ type: () => InsuranceInformationDto, required: false })
  @Type(() => InsuranceInformationDto)
  @ValidateNested({ each: true })
  @IsOptional()
  primaryInsuranceInfo?: InsuranceInformationDto;

  @ApiProperty({ type: () => InsuranceInformationDto, required: false })
  @Type(() => InsuranceInformationDto)
  @ValidateNested({ each: true })
  @IsOptional()
  secondaryInsuranceInfo?: InsuranceInformationDto;

  @ApiProperty({
    type: String,
    required: false,
    pattern: '^[0-9]{9}$',
    maxLength: 9,
    minLength: 9,
  })
  @IsNumberString()
  @Matches(/^[0-9]{9}$/)
  @Optional()
  prescriptionNumber?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @Optional()
  reason?: string;
}
