import {
  Controller,
  Param,
  UseGuards,
  Request,
  Get,
  BadRequestException,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ClientService } from '../client/client.service';
import {
  AdjudicationDto,
  AdjudicationInterfaceDto,
} from './dtos/adjudication.dto';
import { PlanType } from '../core/enums/client';
import { AdjudicationService } from './adjudication.service';
import { AjudicateDto } from 'src/claim/dtos/claim.dto';
import { adjudicate } from '../core/utils/service.util';

@ApiTags('Adjudication')
@Controller('api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AdjudicationController {
  constructor(
    private clientService: ClientService,
    private adjudicationService: AdjudicationService,
  ) {}

  @Get('adjudications')
  @ApiOkResponse({ type: AdjudicationDto })
  async adjudicationInfo(
    @Request() request,
    @Query() query: AdjudicationInterfaceDto,
  ): Promise<AdjudicationDto> {
    const client = await this.clientService.findClientById(query.clientId);
    const adjudication = await this.adjudicationService.create(query);

    if (!client) throw new BadRequestException('Invalid clientID');
    const primaryInsurance = client.primaryInsuranceInfo;
    const secondaryInsurance = client.secondaryInsuranceInfo;
    const today = new Date();

    return {
      IIN:
        query.planType === PlanType.Primary
          ? primaryInsurance.insurer
            ? primaryInsurance.insurer.adjudicatorIIN
            : null
          : secondaryInsurance && secondaryInsurance.insurer
          ? secondaryInsurance.insurer.adjudicatorIIN
          : null,
      providerTransactionDate: today,
      traceNumber: adjudication.traceNumber.toString().padStart(6, '0'),
      carrierID:
        query.planType === PlanType.Primary
          ? primaryInsurance.insurer
            ? primaryInsurance.insurer.carrierId
            : null
          : secondaryInsurance && secondaryInsurance.insurer
          ? secondaryInsurance.insurer.carrierId
          : null,
      groupNumber:
        query.planType === PlanType.Primary
          ? primaryInsurance.groupNumber
          : secondaryInsurance
          ? secondaryInsurance.groupNumber
          : null,
      clientID:
        query.planType === PlanType.Primary
          ? primaryInsurance.clientId
          : secondaryInsurance
          ? secondaryInsurance.clientId
          : null,
      patientCode: null,
      patientDOB: client.generalInfo.birthday,
      cardholderIdentity:
        query.planType === PlanType.Primary
          ? primaryInsurance.cardholderIdentity
          : secondaryInsurance
          ? secondaryInsurance.cardholderIdentity
          : null,
      relationship:
        query.planType === PlanType.Primary
          ? primaryInsurance.relationship
          : secondaryInsurance
          ? secondaryInsurance.relationship
          : null,
      patientFirstName: client.generalInfo.firstName,
      patientLastName: client.generalInfo.lastName,
      patientGender: client.generalInfo.gender,
      medicalReason: null,
      medicalCondition: null,
      adjudicationDate: today,
    };
  }

  @Post('adjudicate')
  async adjudicate(@Request() request, @Body() body: AjudicateDto) {
    return adjudicate({
      ...body,
      client: process.env.CLIENT,
      pharmacyID: process.env.PHARMACYID,
    });
  }
}
