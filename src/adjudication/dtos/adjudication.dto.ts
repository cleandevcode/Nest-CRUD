import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import { Gender } from 'src/core/enums/base';
import { PlanType } from 'src/core/enums/client';

export class AdjudicationInterfaceDto {
  @ApiProperty({ type: String })
  @IsString()
  clientId: string;

  @ApiProperty({ enum: PlanType })
  @IsString()
  planType: PlanType;
}

export class AdjudicationDto {
  @ApiProperty({ type: String })
  @IsString()
  IIN: string;

  @ApiProperty({ type: Date })
  @IsDate()
  providerTransactionDate: Date;

  @ApiProperty({ type: String })
  @IsString()
  traceNumber: string;

  @ApiProperty({ type: String })
  @IsString()
  carrierID: string;

  @ApiProperty({ type: String })
  @IsString()
  groupNumber: string;

  @ApiProperty({ type: String })
  @IsString()
  clientID: string;

  @ApiProperty({ type: String })
  @IsString()
  patientCode: string;

  @ApiProperty({ type: Date })
  @IsDate()
  patientDOB: Date;

  @ApiProperty({ type: String })
  @IsString()
  cardholderIdentity: string;

  @ApiProperty()
  relationship: string;

  @ApiProperty({ type: String })
  @IsString()
  patientFirstName: string;

  @ApiProperty({ type: String })
  @IsString()
  patientLastName: string;

  @ApiProperty({ enum: Gender })
  @IsString()
  patientGender: Gender;

  @ApiProperty({ type: String })
  @IsString()
  medicalReason: string;

  @ApiProperty({ type: String })
  @IsString()
  medicalCondition: string;

  @ApiProperty({ type: Date })
  @IsDate()
  adjudicationDate: Date;
}
