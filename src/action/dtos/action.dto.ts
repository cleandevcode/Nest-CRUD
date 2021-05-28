import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Optional } from '@nestjs/common';

import { ActionType, ActionContentType } from '../../core/enums/action';
import { AbstractDto } from '../../core/dtos/AbstractDto';
import { TablePaginationDto } from '../../core/dtos/table-pagination.dto';
import { Action } from '../entities/action.entity';

export class ActionContent {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsOptional()
  client?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  pin?: string;

  @ApiProperty({ type: String })
  reason: string;
}

export class ActionDto extends AbstractDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty({ enum: ActionType })
  @IsEnum(ActionType)
  type: ActionType;

  @ApiProperty({ enum: ActionContentType })
  @IsEnum(ActionContentType)
  contentType: ActionContentType;

  @ApiProperty({ type: () => ActionContent })
  content: ActionContent;
}

export class ActionTablePaginationDto extends TablePaginationDto {
  @ApiProperty({ required: false, isArray: true, enum: ActionContentType })
  @IsArray()
  @Optional()
  type?: ActionContentType[];
}

export class AuditLogTablePaginationDto extends TablePaginationDto {
  @ApiProperty({ required: false, enum: ActionContentType })
  @IsArray()
  @Optional()
  type?: ActionContentType;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @Optional()
  staff?: string;

  @ApiProperty({ required: false, type: Date })
  @IsDate()
  @Optional()
  startDate?: Date;

  @ApiProperty({ required: false, type: Date })
  @IsDate()
  @Optional()
  endDate?: Date;
}

export class ActionReasonDto {
  @ApiProperty({ required: false, type: String })
  @IsString()
  @Optional()
  reason?: string;
}

export class LatestActionDto {
  @ApiProperty({ type: () => Action })
  userLog: Action;

  @ApiProperty({ type: () => Action })
  insurerLog: Action;

  @ApiProperty({ type: () => Action })
  clinicLog: Action;

  @ApiProperty({ type: () => Action })
  clinicianLog: Action;
}
