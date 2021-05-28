import { ApiProperty } from '@nestjs/swagger';
import { ClaimStatusShortKey } from 'src/core/enums/claim';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../core/abstract.entity';

@Entity('claim_response_response')
export class ClaimResponseResponse extends AbstractEntity {
  @ApiProperty()
  @Column()
  adjudicationDate: string;

  @ApiProperty()
  @Column()
  traceNumber: string;

  @ApiProperty()
  @Column()
  transactionCode: string;

  @ApiProperty()
  @Column()
  referenceNumber: string;

  @ApiProperty({ enum: ClaimStatusShortKey })
  @Column({
    enum: ClaimStatusShortKey,
    default: ClaimStatusShortKey.NotCovered,
  })
  status: ClaimStatusShortKey;

  @ApiProperty()
  @Column()
  code: string;

  @ApiProperty({ type: String, isArray: true })
  @Column({ type: 'simple-array', default: null })
  errors: string[];

  @ApiProperty()
  @Column()
  drugCost: string;

  @ApiProperty()
  @Column()
  costUpcharge: string;

  @ApiProperty()
  @Column()
  genericIncentive: string;

  @ApiProperty()
  @Column()
  professionalFee: string;

  @ApiProperty()
  @Column()
  compoundingCharge: string;

  @ApiProperty()
  @Column()
  specialServicesFee: string;

  @ApiProperty()
  @Column()
  copay: string;

  @ApiProperty()
  @Column()
  deductable: string;

  @ApiProperty()
  @Column()
  coInsurance: string;

  @ApiProperty()
  @Column()
  planPays: string;

  @ApiProperty()
  @Column()
  data1: string;

  @ApiProperty()
  @Column()
  data2: string;

  @ApiProperty()
  @Column()
  data3: string;
}
