import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
import { SortOrder } from '../enums/base';
import { IsString } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ required: false })
  @Optional()
  readonly skip?: number;

  @ApiProperty({ required: false })
  @Optional()
  readonly take?: number;

  @ApiProperty({ required: false })
  @Optional()
  readonly sortBy?: string[];

}

export class SortOptionDto {
  @ApiProperty({ type: String })
  @IsString()
  readonly key: string;

  @ApiProperty({ enum: SortOrder })
  readonly order: SortOrder;
}