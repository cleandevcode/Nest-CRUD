import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Delete,
  Request,
  Ip,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { isNumberString } from 'class-validator';

import { AdjudicatorService } from './adjudicator.service';
import { Adjudicator } from './entities/adjudicator.entity';
import { AdjudicatorContentDto } from './dtos/adjudicator.dto';
import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { RolesGuard } from '../core/guards/roles.guard';
import { Roles } from '../core/decorators/roles.decorator';
import { UserRole } from '../core/enums/user';
import { SuccessResponse } from '../core/models/success-response';
import { ActionType, ActionContentType } from '../core/enums/action';
import { ActionService } from '../action/action.service';
import { ActionReasonDto } from '../action/dtos/action.dto';

const ipaddr = require('ipaddr.js');

@ApiTags('Adjudicator')
@Controller('api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AdjudicatorController {
  constructor(
    private adjudicatorService: AdjudicatorService,
    private actionService: ActionService,
  ) {}

  @Post('adjudicators')
  @ApiOkResponse({ type: Adjudicator })
  async create(
    @Request() request,
    @Body() body: AdjudicatorContentDto,
    @Ip() ip: string,
  ): Promise<Adjudicator> {
    const duplicated = await this.adjudicatorService
      .findAdjudicatorByIINNumber(body.iinNumber)
      .then((adjudicator) => adjudicator)
      .catch((err) => {
        if (err.response?.statusCode === 400) return null;
        throw new InternalServerErrorException('Internal Server Error');
      });

    if (duplicated) throw new BadRequestException('Duplicated IIN Number');

    const adjudicator = await this.adjudicatorService.create(body);
    const ipAddress = ipaddr.process(ip);
    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Create,
        contentType: ActionContentType.Adjudicator,
        content: {
          id: adjudicator.id,
          name: `${adjudicator.name}`,
          reason: body.reason || 'unknown',
        },
      },
      ipAddress.octets.join('.'),
    );

    return adjudicator;
  }

  @Get('adjudicators/all')
  @ApiOkResponse({ type: [Adjudicator] })
  async getAll(@Request() request): Promise<Adjudicator[]> {
    return this.adjudicatorService.getAll();
  }

  @Get('adjudicators/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Adjudicator })
  async adjudicatorDetail(
    @Request() request,
    @Param('id') id: string,
  ): Promise<Adjudicator> {
    if (!isNumberString(id)) {
      throw new BadRequestException('Could not find requested adjudicator.');
    }
    return this.adjudicatorService.findAdjudicatorById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Delete('adjudicators/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  async delete(
    @Request() request,
    @Param('id') id,
    @Ip() ip: string,
    @Body() body: ActionReasonDto,
  ): Promise<SuccessResponse> {
    const adjudicator = await this.adjudicatorService.findAdjudicatorByIINNumber(
      id,
    );
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Delete,
        contentType: ActionContentType.Adjudicator,
        content: {
          id: adjudicator.id,
          name: `${adjudicator.name}`,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return await this.adjudicatorService.deleteAdjudicator(adjudicator.id);
  }
}
