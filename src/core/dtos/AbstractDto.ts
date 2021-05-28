'use strict';
import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { IsOptional, IsString } from 'class-validator';

export class AbstractDto {
  @PrimaryColumn()
  @ApiProperty()
  @IsString()
  id: string;

  @CreateDateColumn()
  @ApiProperty()
  @IsOptional()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  @IsOptional()
  updatedAt?: Date;

  @DeleteDateColumn()
  @ApiProperty()
  @IsOptional()
  deletedAt?: Date;
}
