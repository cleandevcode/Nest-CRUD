import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Ip,
  Get,
  Query,
  Param,
  Delete,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { Validator } from 'node-input-validator';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { ActionService } from 'src/action/action.service';
import { ActionReasonDto } from 'src/action/dtos/action.dto';
import { ClientService } from 'src/client/client.service';
import { defaultTakeCount } from 'src/core/constants/base.constant';
import { Roles } from 'src/core/decorators/roles.decorator';
import { PaginatorDto } from 'src/core/dtos/paginator.dto';
import { TablePaginationDto } from 'src/core/dtos/table-pagination.dto';
import { ActionContentType, ActionType } from 'src/core/enums/action';
import { UserRole } from 'src/core/enums/user';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { SuccessResponse } from 'src/core/models/success-response';
import { UserService } from 'src/user/user.service';
import { ClaimResponseService } from './claim-response.service';
import { ClaimResponseDto } from './dtos/claim-response.dto';
import { ClaimSumary } from './dtos/claim-response.dto';
import { ClaimResponse } from './entities/claimResponse.entity';
import { ClaimService } from 'src/claim/claim.service';
import { ClaimStatus, ClaimStatusShortKey } from 'src/core/enums/claim';
import { ClaimDto } from 'src/claim/dtos/claim.dto';
import { ClinicianService } from 'src/clinician/clinician.service';
const ipaddr = require('ipaddr.js');

@ApiTags('ClaimResponse')
@Controller('api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ClaimResponseController {
  constructor(
    private claimResponseService: ClaimResponseService,
    private actionService: ActionService,
    private userService: UserService,
    private clientService: ClientService,
    private claimService: ClaimService,
    private clinicianService: ClinicianService,
  ) {}

  @Post('claimResponses')
  @ApiOkResponse({ type: ClaimResponse })
  async create(
    @Request() request,
    @Body() body: ClaimResponseDto,
    @Ip() ip: string,
  ): Promise<ClaimResponse> {
    const validator = new Validator(body, {
      orderId: ['required', 'minLength:15', 'maxLength:15', 'regex:[0-9]{15}'],
    });

    const duplicatedOrderId = await validator
      .check()
      .then((matched) => {
        if (!matched) throw new BadRequestException('Invalid order id!');
        return true;
      })
      .then(() =>
        this.claimResponseService.findClaimResponseByOrderId(body.orderId),
      )
      .catch((err) => {
        throw new BadRequestException(err.message);
      });
    const claim = await this.claimService.findClaimById(body.orderId);
    if (!claim) throw new BadRequestException('Non-existing order id!');

    if (!body.clientId || body.clientId === '')
      throw new BadRequestException('Client id required!');
    if (duplicatedOrderId) {
      await this.claimResponseService.removeClaimResponse(body.orderId);
    }

    const claimResonse = await this.claimResponseService.createClaimResponse(
      body,
    );
    const ipAddress = ipaddr.process(ip);

    let notCovered = 0;
    let covered = 0;
    let reversed = 0;

    await Promise.all(
      body.order.map(async (item) => {
        switch (item.status) {
          case ClaimStatusShortKey.Reversed:
            reversed++;
            break;
          case ClaimStatusShortKey.NotCovered:
            notCovered++;
            break;
          default:
            covered++;
            break;
        }
      }),
    );

    let status = ClaimStatus.NotCovered;

    if (covered === body.order.length) status = ClaimStatus.Covered;
    else if (reversed === body.order.length) status = ClaimStatus.Reversed;
    else if (covered > 0) status = ClaimStatus.PartiallyCovered;

    claim.status = status;
    await this.claimService.updateClaim(body.orderId, claim.toClaimDto());

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Create,
        contentType: ActionContentType.ClaimResponse,
        content: {
          id: claimResonse.id,
          name: claimResonse.orderId,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return claimResonse;
  }

  @Get('claimResponses')
  @ApiOkResponse({ type: [ClaimResponse] })
  async claimResponses(
    @Query() query: TablePaginationDto,
    @Request() request,
  ): Promise<PaginatorDto<ClaimResponse>> {
    const [data, count] = await this.claimResponseService.findClaimResponses(
      query.skip || 0,
      query.take || defaultTakeCount,
      query.keyword || '',
    );
    return { data, count };
  }

  @Get('claimResponses/:orderId')
  @ApiImplicitParam({ name: 'orderId', required: true })
  @ApiOkResponse({ type: ClaimResponse })
  async claimResponseDetail(
    @Request() request,
    @Param('orderId') orderId: string,
  ): Promise<ClaimResponse> {
    return this.claimResponseService
      .findClaimResponseByOrderId(orderId)
      .then((response) => {
        if (!response)
          throw new BadRequestException('Non-existing Claim response');
        return response;
      });
  }

  @Get('claimSumary/:orderId')
  @ApiImplicitParam({ name: 'orderId', required: true })
  @ApiOkResponse({ type: ClaimSumary })
  async claimSummary(
    @Request() request,
    @Param('orderId') orderId: string,
  ): Promise<ClaimSumary> {
    const claimRes = await this.claimResponseService.findClaimResponseByOrderId(
      orderId,
    );
    const claim = await this.claimService.findClaimById(orderId);

    if (!claim) throw new BadRequestException('Non-existing Claim');
    const client = claim.client;

    if (!claimRes) throw new BadRequestException('Non-existing Claim response');

    const order = await this.claimService.findClaimById(orderId);
    if (!order) throw new BadRequestException('Non-existing Claim');

    return {
      cardHolderIdentity: client.primaryInsuranceInfo
        ? client.primaryInsuranceInfo.cardholderIdentity
        : null,
      referenceNumber: claimRes.order.map(
        (order) => order.response.referenceNumber,
      ),
      clientId: client.primaryInsuranceInfo
        ? client.primaryInsuranceInfo.clientId
        : null,
      clinicLicense: order && order.clinic ? order.clinic.name : null,
      clientFirstName: client.generalInfo ? client.generalInfo.firstName : null,
      clientLastName: client.generalInfo ? client.generalInfo.lastName : null,
      relationship: client.primaryInsuranceInfo
        ? client.primaryInsuranceInfo.relationship
        : '9',
      clientDOB: client.generalInfo ? client.generalInfo.birthday : null,
      order: claimRes.order || [],
    };
  }

  @Get('claimResponses/all')
  @ApiOkResponse({ type: [ClaimResponse] })
  async allClaimResponse(@Request() request): Promise<ClaimResponse[]> {
    return this.claimResponseService.getAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Delete('claimResponses/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  async delete(
    @Request() request,
    @Param('id') id,
    @Ip() ip: string,
    @Body() body: ActionReasonDto,
  ): Promise<SuccessResponse> {
    const claimResonse = await this.claimResponseService.findClaimResponseById(
      id,
    );
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Delete,
        contentType: ActionContentType.ClaimResponse,
        content: {
          id: claimResonse.id,
          name: claimResonse.orderId,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return await this.claimResponseService.deleteClaimResponse(id);
  }

  /*
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Put('claimResponses/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: ClaimResponse })
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() body: ClaimResponseDto,
    @Ip() ip: string,
  ): Promise<ClaimResponse> {
    const claimResponse = await this.claimResponseService.updateClaimResponse(
      id,
      body,
    );
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Update,
        contentType: ActionContentType.Clinic,
        content: {
          id: claimResponse.id,
          name: claimResponse.orderId,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return claimResponse;
  }
  */
}
