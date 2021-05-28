/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('college')
export class College {

  @ApiProperty({ type: String, pattern: '[0-9]{2}', maxLength: 2, minLength: 2 })
  @PrimaryColumn({ type: 'varchar', length: 2, unique: true })
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

}
