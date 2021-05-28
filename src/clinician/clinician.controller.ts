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
import { ClinicianService } from './clinician.service';
import { CollegeService } from './college.service';

import { Clinician } from './entities/clinician.entity';
import { ClinicianDto } from './dtos/clinician.dtos';
import { College } from './entities/college.entity';
import { CollegeDto } from './dtos/college.dtos';

import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { RolesGuard } from '../core/guards/roles.guard';
import { defaultTakeCount } from '../core/constants/base.constant';
import { PaginatorDto } from '../core/dtos/paginator.dto';
import { TablePaginationDto } from '../core/dtos/table-pagination.dto';
import { Roles } from '../core/decorators/roles.decorator';
import { UserRole } from '../core/enums/user';
import { ActionType, ActionContentType } from '../core/enums/action';
import { getFullName } from '../core/utils/string.util';
import { ActionReasonDto } from '../action/dtos/action.dto';
import { SuccessResponse } from '../core/models/success-response';
import { validateClinician } from 'src/core/validation/clinician';

const ipaddr = require('ipaddr.js');

@ApiTags('Clinician')
@Controller('api')
export class ClinicianController {
  constructor(
    private clinicianService: ClinicianService,
    private actionService: ActionService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('clinicians')
  @ApiOkResponse({ type: Clinician })
  async create(
    @Request() request,
    @Body() body: ClinicianDto,
    @Ip() ip: string,
  ): Promise<Clinician> {
    try {
      const validClinician = validateClinician(body);
      const clinician = await this.clinicianService.createClinician(
        validClinician,
      );
      const ipAddress = ipaddr.process(ip);

      await this.actionService.createAction(
        {
          id: request.user.id,
          user: request.user.id,
          type: ActionType.Create,
          contentType: ActionContentType.Clinician,
          content: {
            id: clinician.id,
            name: getFullName(clinician),
            reason: body.reason || 'Unknown',
          },
        },
        ipAddress.octets.join('.'),
      );
      return clinician;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('clinicians/all')
  @ApiOkResponse({ type: [Clinician] })
  async getAll(@Request() request): Promise<Clinician[]> {
    return this.clinicianService.getAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Get('clinicians/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Clinician })
  async clinicianDetail(
    @Request() request,
    @Param('id') id: string,
  ): Promise<Clinician> {
    if (!id) {
      throw new BadRequestException('Could not find requested client.');
    }
    return this.clinicianService.findClinicianById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Get('clinicians')
  @ApiOkResponse({ type: [Clinician] })
  async clinicians(
    @Query() query: TablePaginationDto,
    @Request() request,
  ): Promise<PaginatorDto<Clinician>> {
    let sortBy = query.sortBy;

    if (typeof query.sortBy === 'string') sortBy = [query.sortBy];

    const [data, count] = await this.clinicianService.findClinicians(
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
  @Put('clinicians/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Clinician })
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() body: ClinicianDto,
    @Ip() ip: string,
  ): Promise<Clinician> {
    try {
      const validClinician = validateClinician(body);
      const clinician = await this.clinicianService.updateClinician(
        id,
        validClinician,
      );
      const ipAddress = ipaddr.process(ip);

      await this.actionService.createAction(
        {
          id: request.user.id,
          user: request.user.id,
          type: ActionType.Update,
          contentType: ActionContentType.Clinician,
          content: {
            id: clinician.id,
            name: getFullName(clinician),
            reason: body.reason || 'Unknown',
          },
        },
        ipAddress.octets.join('.'),
      );
      return clinician;
    } catch (error) {}
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Delete('clinicians/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  async delete(
    @Request() request,
    @Param('id') id,
    @Ip() ip: string,
    @Body() body: ActionReasonDto,
  ): Promise<SuccessResponse> {
    const clinician = await this.clinicianService.findClinicianById(id);
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Delete,
        contentType: ActionContentType.Clinician,
        content: {
          id: clinician.id,
          name: getFullName(clinician),
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return await this.clinicianService.deleteClinician(id);
  }
}

@ApiTags('College')
@Controller('api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CollegeController {
  constructor(
    private collegeService: CollegeService,
    private actionService: ActionService,
  ) {}

  @Post('colleges')
  @ApiOkResponse({ type: College })
  async create(
    @Request() request,
    @Body() body: CollegeDto,
    @Ip() ip: string,
  ): Promise<College> {
    const college = await this.collegeService.createCollege(body);
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Create,
        contentType: ActionContentType.College,
        content: {
          id: college.id,
          name: college.name,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return college;
  }

  @Get('colleges/all')
  @ApiOkResponse({ type: [College] })
  async getAll(@Request() request): Promise<College[]> {
    return this.collegeService.getAll();
  }

  @Get('colleges/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: College })
  async collegeDetail(
    @Request() request,
    @Param('id') id: string,
  ): Promise<College> {
    if (!id) {
      throw new BadRequestException('Could not find requested college.');
    }

    const college = await this.collegeService.findCollegeById(id);
    if (!college) throw new BadRequestException('non-existing college');

    return college;
  }

  @Get('colleges')
  @ApiOkResponse({ type: [College] })
  async clinicians(
    @Query() query: TablePaginationDto,
    @Request() request,
  ): Promise<PaginatorDto<College>> {
    const [data, count] = await this.collegeService.findColleges(
      query.skip || 0,
      query.take || defaultTakeCount,
      query.keyword || '',
    );
    return { data, count };
  }

  @Put('colleges/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: College })
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() body: CollegeDto,
    @Ip() ip: string,
  ): Promise<College> {
    const college = await this.collegeService.updateCollege(id, body);
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Update,
        contentType: ActionContentType.College,
        content: {
          id: college.id,
          name: college.name,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return college;
  }

  @Delete('colleges/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  async delete(
    @Request() request,
    @Param('id') id,
    @Ip() ip: string,
    @Body() body: ActionReasonDto,
  ): Promise<SuccessResponse> {
    const college = await this.collegeService.findCollegeById(id);
    if (!college)
      throw new BadRequestException('Could not delete non-existing college');

    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Delete,
        contentType: ActionContentType.College,
        content: {
          id: college.id,
          name: college.name,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return await this.collegeService.deleteCollege(id);
  }
}
