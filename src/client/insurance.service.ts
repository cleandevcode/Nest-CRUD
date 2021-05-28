import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  InsuranceInformationDto,
  InsuranceDto,
  Insurance,
} from './dtos/client.dto';
import { getFromDto } from '../core/utils/repository.util';
import { InsuranceInformation } from './entities/insurance-information.entity';
import { Client } from './entities/client.entity';

@Injectable()
export class InsuranceService {
  constructor(
    @InjectRepository(InsuranceInformation)
    private readonly insuranceInformationRepository: Repository<InsuranceInformation>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}
  async getInsuranceByClientId(clientId: string): Promise<Insurance> {
    const client = await this.clientRepository.findOne({
      where: { primaryId: clientId },
    });

    if (!client) throw new BadRequestException('Invalid client ID');

    return {
      primaryInsuranceInfo: client.primaryInsuranceInfo,
      secondaryInsuranceInfo: client.secondaryInsuranceInfo,
    };
  }

  async load(id: string): Promise<InsuranceInformation> {
    return this.insuranceInformationRepository.findOne({ id });
  }

  async updateInsurance(
    id: string,
    data: InsuranceInformationDto,
  ): Promise<InsuranceInformation> {
    let insurance = await this.insuranceInformationRepository.findOne({
      where: { id },
    });
    if (!insurance) {
      throw new BadRequestException('Unable to update non-existing insurance.');
    }

    insurance = getFromDto<InsuranceInformation>(data, insurance);

    await this.insuranceInformationRepository.save(insurance);
    return this.load(insurance.id);
  }
}
