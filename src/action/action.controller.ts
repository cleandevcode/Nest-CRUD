import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ActionService } from './action.service';
import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { defaultTakeCount } from '../core/constants/base.constant';
import { PaginatorDto } from '../core/dtos/paginator.dto';
import {
  ActionDto,
  ActionTablePaginationDto,
  AuditLogTablePaginationDto,
  LatestActionDto,
} from './dtos/action.dto';
import { Action } from './entities/action.entity';
import { ActionContentType } from '../core/enums/action';
import { isString } from 'class-validator';

@ApiTags('Action')
@Controller('api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ActionController {
  constructor(private actionService: ActionService) {}

  @Post('actions')
  @ApiOkResponse({ type: Action })
  async create(@Request() request, @Body() body: ActionDto): Promise<Action> {
    return await this.actionService.createAction(body);
  }

  @Get('actions')
  @ApiOkResponse({ type: [Action] })
  async actions(
    @Query() query: ActionTablePaginationDto,
    @Request() request,
  ): Promise<PaginatorDto<Action>> {
    const contentType = query.type || Object.values(ActionContentType);

    const [data, count] = await this.actionService.findActions(
      query.skip || 0,
      query.take || defaultTakeCount,
      query.keyword || '',
      '',
      [],
      contentType,
      new Date(0),
      new Date(),
    );
    return { data, count };
  }

  @Get('actions/latest')
  @ApiOkResponse({ type: LatestActionDto })
  async getLatestActions(@Request() request): Promise<LatestActionDto> {
    return this.actionService.getLatestActions();
  }

  @Get('auditlogs')
  @ApiOkResponse({ type: [Action] })
  async auditLogs(
    @Query() query: AuditLogTablePaginationDto,
    @Request() request,
  ): Promise<PaginatorDto<Action>> {
    const contentType = query.type
      ? [query.type]
      : [
          ActionContentType.Claim,
          ActionContentType.Product,
          ActionContentType.User,
          ActionContentType.Client,
          ActionContentType.Clinic,
          ActionContentType.Clinician,
          ActionContentType.Insurer,
        ];
    const startDate = query.startDate ? new Date(query.startDate) : new Date(0);
    const endDate = query.endDate ? new Date(query.endDate) : new Date();

    let sortBy = query.sortBy;

    if (isString(query.sortBy)) sortBy = [query.sortBy];

    const [data, count] = await this.actionService.findActions(
      query.skip || 0,
      query.take || defaultTakeCount,
      query.keyword || '',
      query.staff || '',
      sortBy,
      contentType,
      startDate,
      endDate,
    );

    return { data, count };
  }
}
