import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import { InsurerService } from './insurer.service';
import { ActionService } from '../action/action.service';
import { Insurer } from './entities/insurer.entity';
import { InsurerDto } from './dtos/insurer.dtos';
import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { RolesGuard } from '../core/guards/roles.guard';
import { defaultTakeCount } from '../core/constants/base.constant';
import { PaginatorDto } from '../core/dtos/paginator.dto';
import { TablePaginationDto } from '../core/dtos/table-pagination.dto';
import { Roles } from '../core/decorators/roles.decorator';
import { UserRole } from '../core/enums/user';
import { SuccessResponse } from '../core/models/success-response';
import { ActionType, ActionContentType } from '../core/enums/action';
import { ActionReasonDto } from 'src/action/dtos/action.dto';
import { getRepository, IsNull, Not } from 'typeorm';

const ipaddr = require('ipaddr.js');

@ApiTags('Insurer')
@Controller('api')
export class InsurerController {
  constructor(
    private insurerService: InsurerService,
    private actionService: ActionService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Post('insurers')
  @ApiOkResponse({ type: Insurer })
  async create(
    @Request() request,
    @Body() body: InsurerDto,
    @Ip() ip: string,
  ): Promise<Insurer> {
    const validInsurer = await this.validateInsurer(body).catch((err) => {
      throw new BadRequestException(err.message);
    });
    const insurer = await this.insurerService.createInsurer(validInsurer);
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Create,
        contentType: ActionContentType.Insurer,
        content: {
          id: insurer.id,
          name: insurer.carrierName,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return insurer;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('insurers/all')
  @ApiOkResponse({ type: [Insurer] })
  async getAll(@Request() request): Promise<Insurer[]> {
    return this.insurerService.getAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Get('insurers/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Insurer })
  async insurerDetail(
    @Request() request,
    @Param('id') id: string,
  ): Promise<Insurer> {
    if (!id) {
      throw new BadRequestException('Could not find requested insurer.');
    }
    return this.insurerService.findInsurerById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Get('insurers')
  @ApiOkResponse({ type: [Insurer] })
  async clinics(
    @Query() query: TablePaginationDto,
    @Request() request,
  ): Promise<PaginatorDto<Insurer>> {
    let sortBy = query.sortBy;

    if (typeof query.sortBy === 'string') sortBy = [query.sortBy];

    const [data, count] = await this.insurerService.findInsurers(
      query.skip || 0,
      query.take || defaultTakeCount,
      query.keyword || '',
      sortBy,
    );
    return { data, count };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Delete('insurers/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  async delete(
    @Request() request,
    @Param('id') id,
    @Ip() ip: string,
    @Body() body: ActionReasonDto,
  ): Promise<SuccessResponse> {
    const insurer = await this.insurerService.findInsurerById(id);
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Delete,
        contentType: ActionContentType.Insurer,
        content: {
          id: insurer.id,
          name: insurer.carrierName,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return await this.insurerService.deleteInsurer(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Put('insurers/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Insurer })
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() body: InsurerDto,
    @Ip() ip: string,
  ): Promise<Insurer> {
    const validInsurer = await this.validateInsurer(body, true, id).catch(
      (err) => {
        throw new BadRequestException(err.message);
      },
    );

    const insurer = await this.insurerService.updateInsurer(id, validInsurer);
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Update,
        contentType: ActionContentType.Insurer,
        content: {
          id: insurer.id,
          name: insurer.carrierName,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return insurer;
  }

  async validateInsurer(
    newInsurer: InsurerDto,
    isUpdate = false,
    id = '',
  ): Promise<InsurerDto> {
    if (!newInsurer.adjudicatorIIN || newInsurer.adjudicatorIIN === '')
      throw new BadRequestException('Adjudicator IIN required!');
    if (!newInsurer.adjudicatorName || newInsurer.adjudicatorName === '')
      throw new BadRequestException('Adjudicator name required!');
    if (
      newInsurer.carrierName &&
      (newInsurer.carrierId === '' || !newInsurer.carrierId)
    )
      throw new BadRequestException('Carrier id required!');
    if (
      newInsurer.carrierId &&
      (!newInsurer.carrierName || newInsurer.carrierName === '')
    )
      throw new BadRequestException('Carrier name required!');

    const duplicates = await getRepository(Insurer).find({
      where: {
        carrierName: newInsurer.carrierName,
        adjudicatorIIN: newInsurer.adjudicatorIIN,
        adjudicatorName: newInsurer.adjudicatorName,
        id: isUpdate ? Not(id) : Not(IsNull()),
      },
    });
    if (duplicates.length > 0)
      throw new BadRequestException('Duplicated insurer!');

    return newInsurer;
  }
}
