import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
import {
  IsString,
  ValidateNested,
  IsNumberString,
  IsNumber,
  IsDate,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AbstractDto } from '../../core/dtos/AbstractDto';
import { ClaimStatusShortKey } from 'src/core/enums/claim';
import { ClaimResponseOrder } from '../entities/claim-response-order.entity';

export class ClaimResponseRequestDto {
  @ApiProperty({
    type: String,
    pattern: '[0-9]{}6',
    minLength: 6,
    maxLength: 6,
  })
  @IsNumberString()
  IIN: string;

  @ApiProperty()
  @IsNumberString()
  versionNumber: string;

  @ApiProperty()
  @IsNumberString()
  transactionCode: string;

  @ApiProperty()
  @IsNumberString()
  providerSoftwareID: string;

  @ApiProperty()
  @IsNumberString()
  providerSoftwareVersion: string;

  @ApiProperty()
  @IsNumberString()
  activeDeviceID: string;

  @ApiProperty()
  @IsNumberString()
  providerTransactionDate: string;

  @ApiProperty()
  @IsNumberString()
  traceNumber: string;

  @ApiProperty()
  @IsNumberString()
  carrierID: string;

  @ApiProperty()
  @IsNumberString()
  groupNumber: string;

  @ApiProperty()
  @IsNumberString()
  clientID: string;

  @ApiProperty()
  @IsNumberString()
  patientCode: string;

  @ApiProperty()
  @IsNumberString()
  patientDOB: string;

  @ApiProperty()
  @IsNumberString()
  cardholderIdentity: string;

  @ApiProperty()
  @IsNumberString()
  relationship: string;

  @ApiProperty()
  @IsNumberString()
  patientFirstName: string;

  @ApiProperty()
  @IsNumberString()
  patientLastName: string;

  @ApiProperty()
  @IsNumberString()
  provincialHCID: string;

  @ApiProperty()
  @IsNumberString()
  patientGender: string;

  @ApiProperty()
  @IsNumberString()
  medicalReason: string;

  @ApiProperty()
  @IsNumberString()
  medicalCondition: string;

  @ApiProperty()
  @IsNumberString()
  refillCode: string;

  @ApiProperty()
  @IsNumberString()
  prescriptionNumber: string;

  @ApiProperty()
  @IsNumberString()
  refillAuth: string;

  @ApiProperty()
  @IsNumberString()
  currentRx: string;

  @ApiProperty()
  @IsNumberString()
  DIN: string;

  @ApiProperty()
  @IsNumberString()
  SSC: string;

  @ApiProperty()
  @IsNumberString()
  quantity: string;

  @ApiProperty()
  @IsNumberString()
  daysSupply: string;

  @ApiProperty()
  @IsNumberString()
  prescriberRefID: string;

  @ApiProperty()
  @IsNumberString()
  prescriberID: string;

  @ApiProperty()
  @IsNumberString()
  productSelectionID: string;

  @ApiProperty()
  @IsNumberString()
  unlistedCompound: string;

  @ApiProperty()
  @IsNumberString()
  specialAuthNumber: string;

  @ApiProperty()
  @IsNumberString()
  exceptionCodes: string;

  @ApiProperty()
  @IsNumberString()
  drugCost: string;

  @ApiProperty()
  @IsNumberString()
  costUpcharge: string;

  @ApiProperty()
  @IsNumberString()
  professionalFee: string;

  @ApiProperty()
  @IsNumberString()
  compoundingTime: string;

  @ApiProperty()
  @IsNumberString()
  specialServiceFees: string;

  @ApiProperty()
  @IsNumberString()
  previouslyPaid: string;

  @ApiProperty()
  @IsNumberString()
  pharmacistID: string;

  @ApiProperty()
  @IsNumberString()
  adjudicationDate: string;
}

export class ClaimResponseRespDto {
  @ApiProperty()
  @IsNumberString()
  adjudicationDate: string;

  @ApiProperty()
  @IsNumberString()
  traceNumber: string;

  @ApiProperty()
  @IsNumberString()
  transactionCode: string;

  @ApiProperty()
  @IsNumberString()
  referenceNumber: string;

  @ApiProperty({ enum: ClaimStatusShortKey })
  @IsEnum(ClaimStatusShortKey)
  status: ClaimStatusShortKey;

  @ApiProperty()
  @IsNumberString()
  code: string;

  @ApiProperty({ type: String, isArray: true })
  @IsNumberString()
  errors: string[];

  @ApiProperty()
  @IsNumberString()
  drugCost: string;

  @ApiProperty()
  @IsNumberString()
  costUpcharge: string;

  @ApiProperty()
  @IsNumberString()
  genericIncentive: string;

  @ApiProperty()
  @IsNumberString()
  professionalFee: string;

  @ApiProperty()
  @IsNumberString()
  compoundingCharge: string;

  @ApiProperty()
  @IsNumberString()
  specialServicesFee: string;

  @ApiProperty()
  @IsNumberString()
  copay: string;

  @ApiProperty()
  @IsNumberString()
  deductable: string;

  @ApiProperty()
  @IsNumberString()
  coInsurance: string;

  @ApiProperty()
  @IsNumberString()
  planPays: string;

  @ApiProperty()
  @IsNumberString()
  data1: string;

  @ApiProperty()
  @IsNumberString()
  data2: string;

  @ApiProperty()
  @IsNumberString()
  data3: string;
}

export class ClaimResponseOrderDto {
  @ApiProperty()
  @IsNumberString()
  din: string;

  @ApiProperty()
  @IsNumberString()
  quantity: string;

  @ApiProperty()
  @IsNumberString()
  unitCost: string;

  @ApiProperty()
  @IsNumberString()
  total: string;

  @ApiProperty()
  @IsNumberString()
  coveredPrimary: string;

  @ApiProperty()
  @IsNumberString()
  coveredSecondary: string;

  @ApiProperty()
  @IsNumberString()
  status: string;

  @ApiProperty({ type: () => ClaimResponseRequestDto })
  @Type(() => ClaimResponseRequestDto)
  @ValidateNested({ each: true })
  request: ClaimResponseRequestDto;

  @ApiProperty({ type: () => ClaimResponseRespDto })
  @Type(() => ClaimResponseRespDto)
  @ValidateNested({ each: true })
  response: ClaimResponseRespDto;
}

export class ClaimResponseDto extends AbstractDto {
  @ApiProperty({
    type: String,
    pattern: '[0-9]{15}',
    maxLength: 15,
    minLength: 15,
  })
  @IsNumberString()
  @Optional()
  orderId: string;

  @ApiProperty({ type: String })
  @IsNumberString()
  @Optional()
  clientId: string;

  @ApiProperty({ type: () => [ClaimResponseOrderDto] })
  @Type(() => ClaimResponseOrderDto)
  @ValidateNested({ each: true })
  order: ClaimResponseOrderDto[];

  @ApiProperty({ type: String, required: false })
  @IsString()
  @Optional()
  reason?: string;
}

export class ClaimSumary {
  @ApiProperty({ type: String })
  @IsString()
  readonly cardHolderIdentity: string;

  @ApiProperty({ type: Array })
  @IsString()
  readonly referenceNumber: string[];

  @ApiProperty({ type: String })
  @IsString()
  readonly clientId: string;

  @ApiProperty({ type: String })
  @IsString()
  readonly clinicLicense: string;

  @ApiProperty({ type: String })
  @IsString()
  readonly clientFirstName: string;

  @ApiProperty({ type: String })
  @IsString()
  readonly clientLastName: string;

  @ApiProperty({ type: String })
  @IsNumber()
  readonly relationship: string;

  @ApiProperty({ type: Date })
  @IsDate()
  readonly clientDOB: Date;

  @ApiProperty()
  @IsArray()
  readonly order: ClaimResponseOrder[];
}
