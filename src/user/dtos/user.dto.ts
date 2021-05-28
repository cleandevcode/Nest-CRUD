import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
import { IsBase64, IsDate, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

import { UserRole } from '../../core/enums/user';
import { AbstractDto } from '../../core/dtos/AbstractDto';

export class UserDto extends AbstractDto{

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({ type: String })
  @IsBase64()
  @IsOptional()
  image: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  readonly role: UserRole;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @Optional()
  reason?: string;

  @ApiProperty()
  @IsDate()
  readonly lastLogin: Date;

}