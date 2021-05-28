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

import { ActionService } from '../action/action.service';
import { ClinicService } from './clinic.service';
import { Clinic } from './entities/clinic.entity';
import { ClinicDto } from './dtos/clinic.dtos';
import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { RolesGuard } from '../core/guards/roles.guard';
import { defaultTakeCount } from '../core/constants/base.constant';
import { PaginatorDto } from '../core/dtos/paginator.dto';
import { TablePaginationDto } from '../core/dtos/table-pagination.dto';
import { Roles } from '../core/decorators/roles.decorator';
import { UserRole } from '../core/enums/user';
import { ActionType, ActionContentType } from '../core/enums/action';
import { ActionReasonDto } from '../action/dtos/action.dto';
import { SuccessResponse } from '../core/models/success-response';

const ipaddr = require('ipaddr.js');

@ApiTags('Clinic')
@Controller('api')
export class ClinicController {
  constructor(
    private clinicService: ClinicService,
    private actionService: ActionService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('clinics')
  @ApiOkResponse({ type: Clinic })
  async create(
    @Request() request,
    @Body() body: ClinicDto,
    @Ip() ip: string,
  ): Promise<Clinic> {
    const clinic = await this.clinicService.createClinic(body);
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Create,
        contentType: ActionContentType.Clinic,
        content: {
          id: clinic.id,
          name: clinic.name,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return clinic;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('clinics/all')
  @ApiOkResponse({ type: [Clinic] })
  async getAll(@Request() request): Promise<Clinic[]> {
    return this.clinicService.getAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Get('clinics/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Clinic })
  async clinicDetail(
    @Request() request,
    @Param('id') id: string,
  ): Promise<Clinic> {
    if (!id) {
      throw new BadRequestException('Could not find requested client.');
    }
    return this.clinicService.findClinicById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Get('clinics')
  @ApiOkResponse({ type: [Clinic] })
  async clinics(
    @Query() query: TablePaginationDto,
    @Request() request,
  ): Promise<PaginatorDto<Clinic>> {
    let sortBy = query.sortBy;

    if (typeof query.sortBy === 'string') sortBy = [query.sortBy];

    const [data, count] = await this.clinicService.findClinics(
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
  @Put('clinics/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Clinic })
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() body: ClinicDto,
    @Ip() ip: string,
  ): Promise<Clinic> {
    const clinic = await this.clinicService.updateClinic(id, body);
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Update,
        contentType: ActionContentType.Clinic,
        content: {
          id: clinic.id,
          name: clinic.name,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return clinic;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Delete('clinics/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  async delete(
    @Request() request,
    @Param('id') id,
    @Ip() ip: string,
    @Body() body: ActionReasonDto,
  ): Promise<SuccessResponse> {
    const clinic = await this.clinicService.findClinicById(id);
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Delete,
        contentType: ActionContentType.Clinic,
        content: {
          id: clinic.id,
          name: clinic.name,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return await this.clinicService.deleteClinic(id);
  }
}
