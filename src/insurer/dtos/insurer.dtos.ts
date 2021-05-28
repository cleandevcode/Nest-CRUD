import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
import { IsNumberString, IsString } from 'class-validator';

export class InsurerDto  {

  @ApiProperty()
  @IsNumberString()
  @Optional()
  carrierId: string;

  @ApiProperty()
  @IsString()
  @Optional()
  carrierName: string;

  @ApiProperty()
  @IsNumberString()
  @Optional()
  adjudicatorIIN: string;

  @ApiProperty()
  @IsString()
  @Optional()
  adjudicatorName: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @Optional()
  reason?: string;

}
