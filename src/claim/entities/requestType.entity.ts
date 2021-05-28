import { ApiProperty } from '@nestjs/swagger';
import { 
  PrimaryColumn, 
  Column, 
  Entity, 
  CreateDateColumn, 
  UpdateDateColumn, 
  DeleteDateColumn 
} from 'typeorm';

@Entity('claim-request-type')
export class ClaimRequestType {

  @ApiProperty()
  @PrimaryColumn({ type: 'varchar', length: 2, unique: true })
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar' })
  name: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

}
