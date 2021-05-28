import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsBase64, IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { UserRole } from '../../core/enums/user';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  msToken: string;

  @ApiProperty({ required: false })
  @IsBase64()
  image?: string;

  @ApiProperty({ enum: UserRole })
  @Optional()
  role?: UserRole;
}
