import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  ManyToOne,
  Column,
  OneToMany,
  JoinColumn,
  AfterLoad,
  getRepository,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Client } from '../../client/entities/client.entity';
import { Clinician } from '../../clinician/entities/clinician.entity';
import { Cart } from './cart.entity';
import { ClaimStatus } from '../../core/enums/claim';
import { AbstractEntity } from '../../core/abstract.entity';
import { ClaimDto } from '../dtos/claim.dto';
import { Action } from '../../action/entities/action.entity';
import { ClaimRequestType } from './requestType.entity';
import { Clinic } from 'src/clinic/entities/clinic.entity';

@Entity('claim')
export class Claim extends AbstractEntity<ClaimDto> {
  @ManyToOne(() => User, (user) => user.claims)
  user: User; // staff

  @ManyToOne(() => Client, (client) => client.claims)
  client: Client;

  @ManyToOne(() => Clinician, (clinician) => clinician.claims)
  clinician: Clinician;

  @OneToMany(() => Cart, (cart) => cart.claim)
  carts: Cart[];

  @OneToMany(() => Action, (action) => action.order)
  action: Action[];

  @ManyToOne(() => ClaimRequestType, (request) => request.id)
  @JoinColumn()
  requestType: ClaimRequestType;

  @ApiProperty({ enum: ClaimStatus })
  @Column({ type: 'enum', enum: ClaimStatus })
  status: ClaimStatus;

  @ApiProperty({ type: Number, required: false })
  @Column({ type: 'decimal', default: null, nullable: true })
  subTotal: number;

  @ApiProperty({ type: Number, required: false })
  @Column({ type: 'decimal', default: null, nullable: true })
  covered: number;

  @ApiProperty({ type: Number, required: false })
  @Column({ type: 'decimal', default: null, nullable: true })
  total: number;

  @ApiProperty({ type: String, required: true })
  @Column({ type: 'varchar', default: null, nullable: true })
  clinicId: string;
  clinic: Clinic;

  @AfterLoad()
  async afterLoad() {
    this.clinic = await getRepository(Clinic).findOne({
      where: { id: this.clinicId },
    });
  }

  toClaimDto(): ClaimDto {
    return {
      id: this.id,
      user: this.user.id,
      client: this.client.id,
      clinician: this.clinician.id,
      clinicId: this.clinicId,
      carts: this.carts.map((cart) => {
        return cart.toCartDto();
      }),
      status: this.status,
      subTotal: this.subTotal,
      covered: this.covered,
      total: this.total,
    };
  }
}
