/* eslint-disable prettier/prettier */
import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { DeleteDateColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CollegeDto {
  @ApiProperty({ type: String, pattern: '[0-9]{2}', maxLength: 2, minLength: 2 })
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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @Optional()
  reason?: string;
}
