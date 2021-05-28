import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../core/abstract.entity';

@Entity('claim_response_request')
export class ClaimResponseRequest extends AbstractEntity {
  @ApiProperty({
    type: String,
    pattern: '[0-9]{}6',
    minLength: 6,
    maxLength: 6,
  })
  @Column()
  IIN: string;

  @ApiProperty()
  @Column()
  versionNumber: string;

  @ApiProperty()
  @Column()
  transactionCode: string;

  @ApiProperty()
  @Column()
  providerSoftwareID: string;

  @ApiProperty()
  @Column()
  providerSoftwareVersion: string;

  @ApiProperty()
  @Column()
  activeDeviceID: string;

  @ApiProperty()
  @Column()
  pharmacyID: string;

  @ApiProperty()
  @Column()
  providerTransactionDate: string;

  @ApiProperty()
  @Column()
  traceNumber: string;

  @ApiProperty()
  @Column()
  carrierID: string;

  @ApiProperty()
  @Column()
  groupNumber: string;

  @ApiProperty()
  @Column()
  clientID: string;

  @ApiProperty()
  @Column()
  patientCode: string;

  @ApiProperty()
  @Column()
  patientDOB: string;

  @ApiProperty()
  @Column()
  cardholderIdentity: string;

  @ApiProperty()
  @Column()
  relationship: string;

  @ApiProperty()
  @Column()
  patientFirstName: string;

  @ApiProperty()
  @Column()
  patientLastName: string;

  @ApiProperty()
  @Column()
  provincialHCID: string;

  @ApiProperty()
  @Column()
  patientGender: string;

  @ApiProperty()
  @Column()
  medicalReason: string;

  @ApiProperty()
  @Column()
  medicalCondition: string;

  @ApiProperty()
  @Column()
  refillCode: string;

  @ApiProperty()
  @Column()
  prescriptionNumber: string;

  @ApiProperty()
  @Column()
  refillAuth: string;

  @ApiProperty()
  @Column()
  currentRx: string;

  @ApiProperty()
  @Column()
  DIN: string;

  @ApiProperty()
  @Column()
  SSC: string;

  @ApiProperty()
  @Column()
  quantity: string;

  @ApiProperty()
  @Column()
  daysSupply: string;

  @ApiProperty()
  @Column()
  prescriberRefID: string;

  @ApiProperty()
  @Column()
  prescriberID: string;

  @ApiProperty()
  @Column()
  productSelectionID: string;

  @ApiProperty()
  @Column()
  unlistedCompound: string;

  @ApiProperty()
  @Column()
  specialAuthNumber: string;

  @ApiProperty()
  @Column()
  exceptionCodes: string;

  @ApiProperty()
  @Column()
  drugCost: string;

  @ApiProperty()
  @Column()
  costUpcharge: string;

  @ApiProperty()
  @Column()
  professionalFee: string;

  @ApiProperty()
  @Column()
  compoundingTime: string;

  @ApiProperty()
  @Column()
  specialServiceFees: string;

  @ApiProperty()
  @Column()
  previouslyPaid: string;

  @ApiProperty()
  @Column()
  pharmacistID: string;

  @ApiProperty()
  @Column()
  adjudicationDate: string;
}
