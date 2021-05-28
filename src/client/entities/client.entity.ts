import {
  Entity,
  OneToOne,
  OneToMany,
  Column,
  AfterLoad,
  getRepository,
} from 'typeorm';

import { GeneralInformation } from './general-information.entity';
import { InsuranceInformation } from './insurance-information.entity';
import { Claim } from '../../claim/entities/claim.entity';
import { ClientDto } from '../dtos/client.dto';
import { AbstractEntity } from '../../core/abstract.entity';
import { IsNumberString } from 'class-validator';
import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Action } from 'src/action/entities/action.entity';
import { ActionContentType, ActionType } from 'src/core/enums/action';

@Entity('client')
export class Client extends AbstractEntity<ClientDto> {
  @ApiProperty({
    type: String,
    required: false,
    pattern: '[0-9]{9}',
    maxLength: 9,
    minLength: 9,
  })
  @IsNumberString()
  @Optional()
  @Column({ type: 'varchar', length: 9, nullable: true })
  prescriptionNumber?: string;
  lastClaim: Date;

  @OneToOne(
    () => GeneralInformation,
    (generalInformation) => generalInformation.client,
  )
  generalInfo: GeneralInformation;

  @OneToOne(
    () => InsuranceInformation,
    (insuranceInformation) => insuranceInformation.primary,
  )
  primaryInsuranceInfo: InsuranceInformation;

  @OneToOne(
    () => InsuranceInformation,
    (insuranceInformation) => insuranceInformation.secondary,
  )
  secondaryInsuranceInfo: InsuranceInformation;

  @OneToMany(() => Claim, (claim) => claim.client)
  claims: Claim[];

  @AfterLoad()
  async afterLoad() {
    this.lastClaim = await getRepository(Action)
      .createQueryBuilder('log')
      .where({ contentType: ActionContentType.Claim, type: ActionType.Create })
      .andWhere(`log.content::json->>'client' = '${this.id}'`)
      .orderBy('log.createdAt', 'DESC')
      .getOne()
      .then((record) => {
        console.log('Action : ', record);
        if (!record) return null;
        return record.createdAt;
      });
  }
}
