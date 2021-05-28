import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Claim } from '../../claim/entities/claim.entity';
import { ActionType, ActionContentType } from '../../core/enums/action';
import { AbstractEntity } from '../../core/abstract.entity';
import { ActionContent, ActionDto } from '../dtos/action.dto';

@Entity('log')
export class Action extends AbstractEntity<ActionDto> {
  @ManyToOne(() => User, (user) => user.actions)
  user: User;

  @ManyToOne(() => Claim, (claim) => claim.action)
  order: Claim;

  @ApiProperty({ enum: ActionType })
  @Column({ type: 'enum', enum: ActionType })
  type: ActionType;

  @ApiProperty({ enum: ActionContentType })
  @Column({ type: 'enum', enum: ActionContentType })
  contentType: ActionContentType;

  @Column({ type: 'jsonb', default: undefined, nullable: true })
  @ApiProperty({ type: () => ActionContent })
  content: ActionContent;

  @Column({ type: 'cidr', nullable: true })
  @ApiProperty({ type: 'string' })
  ipAddress: string;
}
