import {
  BadRequestException,
  Body,
  Get,
  Ip,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  Delete,
  Controller,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { isNumberString } from 'class-validator';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import { ActionService } from '../action/action.service';
import { ClientService } from './client.service';
import { Client } from './entities/client.entity';
import {
  ClientDto,
  InsuranceDto,
  GeneralInformationDto,
  Insurance,
} from './dtos/client.dto';
import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { defaultTakeCount } from '../core/constants/base.constant';
import { PaginatorDto } from '../core/dtos/paginator.dto';
import { TablePaginationDto } from '../core/dtos/table-pagination.dto';
import { ActionType, ActionContentType } from '../core/enums/action';
import { getFullName } from '../core/utils/string.util';
import { UserRole } from '../core/enums/user';
import { Roles } from '../core/decorators/roles.decorator';
import { RolesGuard } from '../core/guards/roles.guard';
import { ActionReasonDto } from '../action/dtos/action.dto';
import { SuccessResponse } from '../core/models/success-response';
import { UserService } from '../user/user.service';
import { InsuranceService } from './insurance.service';
import { GeneralInformation } from './entities/general-information.entity';
import { validateClientDto } from 'src/core/validation/client';

const ipaddr = require('ipaddr.js');

@ApiTags('Client')
@Controller('api')
export class ClientController {
  constructor(
    private clientService: ClientService,
    private actionService: ActionService,
    private userService: UserService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('clients')
  @ApiOkResponse({ type: Client })
  async create(
    @Request() request,
    @Body() body: ClientDto,
    @Ip() ip: string,
  ): Promise<Client> {
    const client = await validateClientDto(body);
    if (!client.validation) throw new BadRequestException(client.message);
    const newClient = await this.clientService.createClient(client.data);
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Create,
        contentType: ActionContentType.Client,
        content: {
          id: newClient.id,
          name: getFullName(newClient.generalInfo),
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return newClient;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('clients/all')
  @ApiOkResponse({ type: [Client] })
  async getAll(@Request() request): Promise<Client[]> {
    return this.clientService.getAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('clients/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Client })
  async clientDetail(
    @Request() request,
    @Param('id') id: string,
  ): Promise<Client> {
    if (!isNumberString(id)) {
      throw new BadRequestException('Could not find requested client.');
    }
    return this.clientService.findClientById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('clients/:id/generalInfo')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: GeneralInformation })
  async clientGeneralInfo(
    @Request() request,
    @Param('id') id: string,
  ): Promise<GeneralInformation> {
    if (!isNumberString(id)) {
      throw new BadRequestException('Could not find requested client.');
    }

    return this.clientService.getGeneralInfo(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('clients')
  @ApiOkResponse({ type: [Client] })
  async clients(
    @Query() query: TablePaginationDto,
    @Request() request,
  ): Promise<PaginatorDto<Client>> {
    let sortBy = query.sortBy;

    if (typeof query.sortBy === 'string') sortBy = [query.sortBy];

    const [data, count] = await this.clientService.findClients(
      query.skip || 0,
      query.take || defaultTakeCount,
      query.keyword || '',
      sortBy,
    );
    return { data, count };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('clients/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Client })
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() body: ClientDto,
    @Ip() ip: string,
  ): Promise<Client> {
    const client = await validateClientDto(body);
    if (!client.validation) throw new BadRequestException(client.message);

    const newClient = await this.clientService.updateClient(id, client.data);
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Update,
        contentType: ActionContentType.Client,
        content: {
          id: newClient.id,
          name: getFullName(newClient.generalInfo),
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );

    return newClient;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('clients/:id/generalInfo')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: GeneralInformation })
  async updateGeneralInfo(
    @Request() request,
    @Param('id') id: string,
    @Body() body: GeneralInformationDto,
    @Ip() ip: string,
  ): Promise<GeneralInformation> {
    const generalInfo = await this.clientService.updateGeneralInfo(id, body);

    const ipAddress = ipaddr.process(ip);
    const client = await this.clientService.findClientById(id);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Update,
        contentType: ActionContentType.Client,
        content: {
          id: client.id,
          name: getFullName(client.generalInfo),
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return generalInfo;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Delete('clients/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  async delete(
    @Request() request,
    @Param('id') id,
    @Ip() ip: string,
    @Body() body: ActionReasonDto,
  ): Promise<SuccessResponse> {
    const client = await this.clientService.findClientById(id);
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Delete,
        contentType: ActionContentType.Client,
        content: {
          id: client.id,
          name: getFullName(client.generalInfo),
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return await this.clientService.deleteClient(id);
  }
}

@ApiTags('Insurance')
@Controller('api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class InsuranceController {
  constructor(
    private actionService: ActionService,
    private clientService: ClientService,
    private insuranceService: InsuranceService,
  ) {}

  @Get('insurance/:clientId')
  @ApiImplicitParam({ name: 'clientId', required: true })
  @ApiOkResponse({ type: InsuranceDto })
  async getInsuranceByClientId(
    @Request() request,
    @Param('clientId') clientId: string,
  ): Promise<Insurance> {
    const client = await this.clientService.findClientById(clientId);
    if (!client) throw new BadRequestException('Invalid client Id');

    return {
      primaryInsuranceInfo: client.primaryInsuranceInfo,
      secondaryInsuranceInfo: client.secondaryInsuranceInfo,
    };
  }

  @Put('insurance/:clientId')
  @ApiImplicitParam({ name: 'clientId', required: true })
  @ApiOkResponse({ type: InsuranceDto })
  async update(
    @Request() request,
    @Param('clientId') clientId: string,
    @Body() body: InsuranceDto,
    @Ip() ip: string,
  ): Promise<Insurance> {
    const primaryInfo = await this.insuranceService.updateInsurance(
      body.primaryInsuranceInfo.id,
      body.primaryInsuranceInfo,
    );
    const secondaryInfo = await this.insuranceService.updateInsurance(
      body.secondaryInsuranceInfo.id,
      body.secondaryInsuranceInfo,
    );

    const ipAddress = ipaddr.process(ip);
    const client = await this.clientService.findClientById(clientId);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Update,
        contentType: ActionContentType.Client,
        content: {
          id: clientId,
          name: getFullName(client.generalInfo),
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );

    return {
      primaryInsuranceInfo: client.primaryInsuranceInfo,
      secondaryInsuranceInfo: client.secondaryInsuranceInfo,
    };
  }
}
