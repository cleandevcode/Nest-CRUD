import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  ValidateNested,
  IsNumber,
  IsNotEmpty,
  IsString,
  IsDate,
} from 'class-validator';

import { ClaimStatus } from '../../core/enums/claim';
import { AbstractDto } from '../../core/dtos/AbstractDto';
import { TablePaginationDto } from '../../core/dtos/table-pagination.dto';
import { Optional } from '@nestjs/common';

export class CartDto extends AbstractDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  product: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  quantity: number;
}

export class ClaimDto extends AbstractDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  client: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clinician: string;

  @ApiProperty()
  @IsString()
  clinicId: string;

  @ApiProperty({ type: () => CartDto, isArray: true })
  @ValidateNested({ each: true })
  @IsOptional()
  carts?: CartDto[];

  @ApiProperty({ enum: ClaimStatus })
  @IsEnum(ClaimStatus)
  status: ClaimStatus;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  subTotal?: number;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  covered?: number;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  total?: number;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @Optional()
  reason?: string;
}

export class RequestTypeDto {
  @ApiProperty({ type: String, maxLength: 2 })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;
}

export class TransactionTablePaginationDto extends TablePaginationDto {
  @ApiProperty({ type: String, pattern: '[0-9]{6}', required: false })
  @IsString()
  @Optional()
  provider: string;

  @ApiProperty({ type: String, pattern: '[0-9]{2}', required: false })
  @IsString()
  @Optional()
  requestType: string;

  @ApiProperty({ type: String, pattern: '[0-9]{2}', required: false })
  @IsString()
  @Optional()
  insurer: string;

  @ApiProperty({ type: Date, required: false })
  @IsDate()
  @Optional()
  startDate: Date;

  @ApiProperty({ type: Date, required: false })
  @IsDate()
  @Optional()
  endDate: Date;

  @ApiProperty({ required: false, enum: ClaimStatus })
  @Optional()
  status: ClaimStatus;

  @ApiProperty({ type: String, required: false })
  @Optional()
  lastName: string;
}

export class AjudicateDto {
  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  IIN: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  versionNumber: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  transactionCode: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  providerSoftwareID: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  providerSoftwareVersion: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  activeDeviceID: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  providerTransactionDate: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  traceNumber: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  carrierID: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  groupNumber: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  clientID: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  patientCode: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  patientDOB: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  cardholderIdentity: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  relationship: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  patientFirstName: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  patientLastName: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  provincialHCID: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  patientGender: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  medicalReason: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  medicalCondition: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  refillCode: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  prescriptionNumber: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  refillAuth: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  currentRx: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  DIN: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  SSC: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  quantity: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  daysSupply: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  prescriberRefID: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  prescriberID: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  productSelectionID: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  unlistedCompound: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  specialAuthNumber: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  exceptionCodes: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  drugCost: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  costUpcharge: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  professionalFee: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  compoundingCharge: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  compoundingTime: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  specialServiceFees: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  previouslyPaid: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  pharmacistID: string;

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  adjudicationDate: string;
}
