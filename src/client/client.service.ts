import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ClientDto, GeneralInformationDto } from './dtos/client.dto';
import { getFromDto, validateSortOption } from '../core/utils/repository.util';
import { SuccessResponse } from '../core/models/success-response';

import { GeneralInformation } from './entities/general-information.entity';
import { InsuranceInformation } from './entities/insurance-information.entity';
import { Client } from './entities/client.entity';
import { ClientSortKey } from 'src/core/enums/client';
import { SortOrder } from 'src/core/enums/base';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(GeneralInformation)
    private readonly generalInformationRepository: Repository<GeneralInformation>,
    @InjectRepository(InsuranceInformation)
    private readonly insuranceInformationRepository: Repository<InsuranceInformation>,
  ) {}

  async createClient(clientDto: ClientDto) {
    let client = new Client();
    client = await this.loadClient(client, clientDto);
    const added = await this.clientRepository.save(client);
    return this.findClientById(added.id);
  }

  async updateClient(clientId: string, data: ClientDto): Promise<Client> {
    let client = await this.findClientById(clientId);
    if (!client) {
      throw new BadRequestException('Unable to update non-existing client.');
    }
    client = await this.loadClient(client, data, true);
    await this.clientRepository.save(client);
    return this.findClientById(client.id);
  }

  async findClients(
    skip: number,
    take: number,
    keyword = '',
    sortBy: string[] = [],
  ): Promise<[Client[], number]> {
    const whereClause = `(client.id::text ilike :keyword or generalInfo.firstName ilike :keyword or generalInfo.lastName ilike :keyword or generalInfo.phoneNumber ilike :keyword or generalInfo.mobileNumber ilike :keyword)`;

    const orderQuery = {};
    let sortInfo;

    if (sortBy.length > 0) {
      sortBy.map((item) => {
        sortInfo = validateSortOption(ClientSortKey, item);

        switch (sortInfo.key) {
          case ClientSortKey.id:
            orderQuery['client.id'] = sortInfo.order;
            break;
          case ClientSortKey.name:
            orderQuery['generalInfo.lastName'] = sortInfo.order;
            break;
          case ClientSortKey.lastClaim:
            orderQuery['client.createdAt'] = sortInfo.order;
            break;
          default:
            break;
        }
      });
    } else {
      orderQuery['client.createdAt'] = SortOrder.Desc;
    }

    return await this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.generalInfo', 'generalInfo')
      .leftJoinAndSelect('client.primaryInsuranceInfo', 'primaryInsuranceInfo')
      .leftJoinAndSelect(
        'client.secondaryInsuranceInfo',
        'secondaryInsuranceInfo',
      )
      .where(whereClause, { keyword: `%${keyword}%` })
      .orderBy(orderQuery)
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async findClientsByKeyword(keyword: string): Promise<Client[]> {
    const whereClause = `(client.id::text ilike :keyword or generalInfo.firstName ilike :keyword or generalInfo.lastName ilike :keyword or generalInfo.phoneNumber ilike :keyword or generalInfo.mobileNumber ilike :keyword)`;
    return await this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.generalInfo', 'generalInfo')
      .leftJoinAndSelect('client.primaryInsuranceInfo', 'primaryInsuranceInfo')
      .leftJoinAndSelect(
        'client.secondaryInsuranceInfo',
        'secondaryInsuranceInfo',
      )
      .where(whereClause, { keyword: `%${keyword}%` })
      .addOrderBy('client.createdAt', 'ASC')
      .limit(3)
      .getMany();
  }

  async getAll(): Promise<Client[]> {
    return await this.clientRepository.find({
      relations: [
        'generalInfo',
        'primaryInsuranceInfo',
        'secondaryInsuranceInfo',
      ],
    });
  }

  async findClientById(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      relations: [
        'generalInfo',
        'primaryInsuranceInfo',
        'secondaryInsuranceInfo',
      ],
      where: {
        id,
      },
    });
    if (!client) {
      throw new BadRequestException('Could not find requested client.');
    }
    return client;
  }

  async loadClient(
    client: Client,
    data: ClientDto,
    isUpdate = false,
  ): Promise<Client> {
    const generalInfo = getFromDto<GeneralInformation>(
      data.generalInfo,
      new GeneralInformation(),
    );

    let secondaryInsuranceInfo = new InsuranceInformation();
    let primaryInsuranceInfo = new InsuranceInformation();

    if (data.primaryInsuranceInfo) {
      primaryInsuranceInfo = getFromDto<InsuranceInformation>(
        data.primaryInsuranceInfo,
        primaryInsuranceInfo,
      );
    }

    if (data.secondaryInsuranceInfo) {
      secondaryInsuranceInfo = getFromDto<InsuranceInformation>(
        data.secondaryInsuranceInfo,
        secondaryInsuranceInfo,
      );
    }

    if (isUpdate) {
      generalInfo.id = client.generalInfo.id;
      primaryInsuranceInfo.id = data.primaryInsuranceInfo
        ? client.primaryInsuranceInfo
          ? client.primaryInsuranceInfo.id
          : null
        : null;
      secondaryInsuranceInfo.id = data.secondaryInsuranceInfo
        ? client.secondaryInsuranceInfo
          ? client.secondaryInsuranceInfo.id
          : null
        : null;
    }

    client.prescriptionNumber = data.prescriptionNumber;
    client.generalInfo = await this.generalInformationRepository.save(
      generalInfo,
    );

    client.primaryInsuranceInfo = data.primaryInsuranceInfo
      ? await this.insuranceInformationRepository.save(primaryInsuranceInfo)
      : null;
    client.secondaryInsuranceInfo = data.secondaryInsuranceInfo
      ? await this.insuranceInformationRepository.save(secondaryInsuranceInfo)
      : null;
    return client;
  }

  async deleteClient(id: string): Promise<SuccessResponse> {
    await this.clientRepository.softDelete({ id });
    return new SuccessResponse(true);
  }

  //General Information APIs

  async getGeneralInfo(id: string): Promise<GeneralInformation> {
    return this.generalInformationRepository.findOne({ where: { client: id } });
  }

  async updateGeneralInfo(
    id: string,
    data: GeneralInformationDto,
  ): Promise<GeneralInformation> {
    let generalInfo = await this.getGeneralInfo(id);

    if (!generalInfo) {
      throw new BadRequestException(
        'Unable to update non-existing general information.',
      );
    }

    generalInfo = getFromDto<GeneralInformation>(data, generalInfo);

    await this.generalInformationRepository.save(generalInfo);

    return generalInfo;
  }
}
