import { ApiProperty } from '@nestjs/swagger';
import { AfterLoad, Column, Entity, getRepository } from 'typeorm';
import { ClaimResponse } from './claimResponse.entity';
import { AbstractEntity } from '../../core/abstract.entity';
import { ClaimResponseRequest } from './claim-response-request.entity';
import { ClaimResponseResponse } from './claim-response-response.entity';

@Entity('claim_response_order')
export class ClaimResponseOrder extends AbstractEntity {
  @ApiProperty()
  @Column()
  din: string;

  @ApiProperty()
  @Column()
  quantity: string;

  @ApiProperty()
  @Column()
  unitCost: string;

  @ApiProperty()
  @Column()
  total: string;

  @ApiProperty()
  @Column()
  coveredPrimary: string;

  @ApiProperty()
  @Column()
  coveredSecondary: string;

  @ApiProperty()
  @Column()
  status: string;

  @ApiProperty()
  @Column({ nullable: true })
  requestId: string;
  request: ClaimResponseRequest;

  @ApiProperty()
  @Column({ nullable: true })
  responseId: string;
  response: ClaimResponseResponse;

  @ApiProperty()
  @Column({ nullable: true })
  claimResponse: string;

  @AfterLoad()
  async afterLoad() {
    this.request = await getRepository(ClaimResponseRequest).findOne({
      where: { id: this.requestId },
    });
    this.response = await getRepository(ClaimResponseResponse).findOne({
      where: { id: this.responseId },
    });
    delete this.requestId;
    delete this.responseId;
  }
}
