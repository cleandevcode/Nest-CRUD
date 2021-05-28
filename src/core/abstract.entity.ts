'use strict';

import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import { AbstractDto } from './dtos/AbstractDto';
import { generateRandomId } from './utils/string.util';

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
  @ApiProperty({ type: 'string' })
  @PrimaryColumn()
  id: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @BeforeInsert()
  private beforeInsert() {
    this.id = generateRandomId(15);
  }
}
