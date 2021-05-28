import { Entity, Column, AfterLoad, getRepository } from 'typeorm';

import { ClaimResponseDto } from '../dtos/claim-response.dto';
import { AbstractEntity } from '../../core/abstract.entity';
import { ClaimResponseOrder } from './claim-response-order.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('claimResponse')
export class ClaimResponse extends AbstractEntity<ClaimResponseDto> {
  @ApiProperty({
    type: String,
    pattern: '[0-9]{15}',
    maxLength: 15,
    minLength: 15,
  })
  @Column({ type: 'varchar', nullable: true, unique: true, length: 15 })
  orderId: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', nullable: true })
  clientId: string;

  @ApiProperty({ type: String, required: false })
  @Column({ type: 'varchar', nullable: true })
  reason?: string;
  order: ClaimResponseOrder[];

  @AfterLoad()
  async afterLoad() {
    this.order = await getRepository(ClaimResponseOrder).find({
      where: { claimResponse: this.id },
    });
  }
}
