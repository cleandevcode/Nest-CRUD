import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  getRepository,
  AfterLoad,
} from 'typeorm';

import { Client } from './client.entity';
import { AbstractEntity } from '../../core/abstract.entity';
import { Insurer } from '../../insurer/entities/insurer.entity';
import { Adjudicator } from '../../adjudicator/entities/adjudicator.entity';

@Entity('client_insurance_information')
export class InsuranceInformation extends AbstractEntity {
  @ApiProperty()
  @Column({ nullable: true })
  insurerId: string;
  insurer: Insurer;

  @ApiProperty()
  @Column({ nullable: true })
  groupNumber: string;

  @ApiProperty()
  @Column({ nullable: true })
  clientId: string;

  @ApiProperty()
  @Column({ nullable: true })
  patientCode: string;

  @ApiProperty()
  @Column()
  cardholderIdentity: string;

  @ApiProperty()
  @Column({ type: 'varchar', default: '0', nullable: true })
  relationship: string;

  @OneToOne(() => Client, (client) => client.primaryInsuranceInfo)
  @JoinColumn()
  primary: Client;

  @OneToOne(() => Client, (client) => client.secondaryInsuranceInfo)
  @JoinColumn()
  secondary: Client;

  @AfterLoad()
  async afterLoad() {
    this.insurer = await getRepository(Insurer).findOne({
      where: { id: this.insurerId },
    });
    // delete this.insurerId;
  }
}
