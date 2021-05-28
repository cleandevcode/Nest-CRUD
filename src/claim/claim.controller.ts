import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Ip,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { isNumberString } from 'class-validator';

import {
  ClaimDto,
  RequestTypeDto,
  TransactionTablePaginationDto,
} from './dtos/claim.dto';
import { PaginatorDto } from '../core/dtos/paginator.dto';
import { TablePaginationDto } from '../core/dtos/table-pagination.dto';
import { UserRole } from '../core/enums/user';
import { Roles } from '../core/decorators/roles.decorator';
import { RolesGuard } from '../core/guards/roles.guard';
import { ActionReasonDto } from '../action/dtos/action.dto';
import { SuccessResponse } from '../core/models/success-response';

import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { defaultTakeCount } from '../core/constants/base.constant';
import { ActionType, ActionContentType } from '../core/enums/action';

import { Claim } from './entities/claim.entity';
import { ClaimRequestType } from './entities/requestType.entity';

import { ClaimService } from './claim.service';
import { ActionService } from '../action/action.service';
import { getFullName } from '../core/utils/string.util';
import { validateClaim } from 'src/core/validation/claim';

const ipaddr = require('ipaddr.js');

@ApiTags('Claim')
@Controller('api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ClaimController {
  constructor(
    private claimService: ClaimService,
    private actionService: ActionService,
  ) {}

  @Post('claims')
  @ApiOkResponse({ type: Claim })
  async create(
    @Request() request,
    @Body() body: ClaimDto,
    @Ip() ip: string,
  ): Promise<Claim> {
    try {
      const validClaim = await validateClaim(body);
      const claim = await this.claimService.createClaim(validClaim);
      const ipAddress = ipaddr.process(ip);
      await this.actionService.createAction(
        {
          id: request.user.id,
          user: request.user.id,
          type: ActionType.Create,
          contentType: ActionContentType.Claim,
          content: {
            id: claim.id,
            client: claim.client.id,
            name: getFullName(claim.client.generalInfo),
            reason: body.reason || 'Unknown',
          },
        },
        ipAddress.octets.join('.'),
      );
      return claim;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('claims/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Claim })
  async claimDetail(
    @Request() request,
    @Param('id') id: string,
  ): Promise<Claim> {
    if (!isNumberString(id)) {
      throw new BadRequestException('Could not find requested claim.');
    }
    return this.claimService.findClaimById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('claims')
  @ApiOkResponse({ type: [Claim] })
  async claims(
    @Query() query: TablePaginationDto,
    @Request() request,
  ): Promise<PaginatorDto<Claim>> {
    let sortBy = query.sortBy;

    if (typeof query.sortBy === 'string') sortBy = [query.sortBy];

    const [data, count] = await this.claimService.findClaims(
      query.skip || 0,
      query.take || defaultTakeCount,
      query.keyword || '',
      sortBy,
    );
    return { data, count };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('claims/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Claim })
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() body: ClaimDto,
    @Ip() ip: string,
  ): Promise<Claim> {
    try {
      const validClaim = await validateClaim(body);
      const claim = await this.claimService.updateClaim(id, validClaim);
      const ipAddress = ipaddr.process(ip);

      await this.actionService.createAction(
        {
          id: request.user.id,
          user: request.user.id,
          type: ActionType.Update,
          contentType: ActionContentType.Claim,
          content: {
            id: claim.id,
            client: claim.client.id,
            name: getFullName(claim.client.generalInfo),
            reason: body.reason || 'Unknown',
          },
        },
        ipAddress.octets.join('.'),
      );
      return claim;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Delete('claims/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  async delete(
    @Request() request,
    @Param('id') id,
    @Ip() ip: string,
    @Body() body: ActionReasonDto,
  ): Promise<SuccessResponse> {
    const claim = await this.claimService.findClaimById(id);
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Delete,
        contentType: ActionContentType.Claim,
        content: {
          id: claim.id,
          client: claim.client.id,
          name: getFullName(claim.client.generalInfo),
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return await this.claimService.deleteClaim(id);
  }

  @Get('transactions')
  @ApiOkResponse({ type: Claim })
  async translactions(
    @Query() query: TransactionTablePaginationDto,
    @Request() request,
  ): Promise<PaginatorDto<Claim>> {
    const startDate = query.startDate ? new Date(query.startDate) : new Date(0);
    const endDate = query.endDate ? new Date(query.endDate) : new Date();

    let sortBy = query.sortBy;

    if (typeof query.sortBy === 'string') sortBy = [query.sortBy];

    const [data, count] = await this.claimService.findTransactions(
      query.skip || 0,
      query.take || defaultTakeCount,
      query.keyword || '',
      query.provider,
      query.insurer,
      startDate,
      endDate,
      query.status,
      query.requestType,
      query.lastName || '',
      sortBy,
    );
    return { data, count };
  }

  @Post('requestTypes')
  @ApiOkResponse({ type: ClaimRequestType })
  async addRequestType(
    @Request() request,
    @Body() body: RequestTypeDto,
  ): Promise<ClaimRequestType> {
    return await this.claimService.createRequestType(body);
  }

  @Get('requestTypes/all')
  @ApiOkResponse({ type: [ClaimRequestType] })
  async allRequestTypes(@Request() request): Promise<Array<ClaimRequestType>> {
    return await this.claimService.getAllRequestTypes();
  }
}
