import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Insurer } from './entities/insurer.entity';
import { InsurerDto } from './dtos/insurer.dtos';
import { getFromDto, validateSortOption } from '../core/utils/repository.util';
import { SuccessResponse } from '../core/models/success-response';
import { InsurerSortKey } from 'src/core/enums/insurer';
import { SortOrder } from 'src/core/enums/base';

@Injectable()
export class InsurerService {
  constructor(
    @InjectRepository(Insurer)
    private readonly insurerRepository: Repository<Insurer>,
  ) {}

  async createInsurer(body: InsurerDto, throwError = true): Promise<Insurer> {
    const insurer = getFromDto<Insurer>(body, new Insurer());
    const added = await this.insurerRepository.save(insurer);
    return this.findInsurerById(added.id);
  }

  async updateInsurer(insurerId: string, data: InsurerDto): Promise<Insurer> {
    let insurer = await this.findInsurerById(insurerId);
    if (!insurer) {
      throw new BadRequestException('Unable to update non-existing insurer.');
    }
    insurer = getFromDto<Insurer>(data, insurer);
    await this.insurerRepository.save(insurer);
    return this.findInsurerById(insurer.id);
  }

  async findInsurers(
    skip: number,
    take: number,
    keyword = '',
    sortBy: string[] = [],
  ): Promise<[Insurer[], number]> {
    const orderQuery = {};
    let sortInfo;

    if (sortBy.length > 0) {
      sortBy.map((item) => {
        sortInfo = validateSortOption(InsurerSortKey, item);

        switch (sortInfo.key) {
          case InsurerSortKey.carrierId:
            orderQuery['insurer.carrierId'] = sortInfo.order;
            break;
          case InsurerSortKey.carrierName:
            orderQuery['insurer.carrierName'] = sortInfo.order;
            break;
          case InsurerSortKey.adjudicatorIIN:
            orderQuery['insurer.adjudicatorIIN'] = sortInfo.order;
            break;
          case InsurerSortKey.adjudicatorName:
            orderQuery['insurer.adjudicatorName'] = sortInfo.order;
            break;
          case InsurerSortKey.createdAt:
            orderQuery['insurer.createdAt'] = sortInfo.order;
            break;
          default:
            break;
        }
      });
    } else {
      orderQuery['insurer.createdAt'] = SortOrder.Desc;
    }

    let whereClause = `LOWER(insurer.adjudicatorName) like :keyword`;
    if (keyword && keyword !== '') {
      whereClause += ` OR LOWER(insurer.carrierName) like :keyword`;
    }
    const [insurers, count] = await this.insurerRepository
      .createQueryBuilder('insurer')
      .where(whereClause, {
        keyword: '%' + keyword.toLowerCase() + '%',
      })
      .orderBy(orderQuery)
      .skip(skip)
      .take(take)
      .getManyAndCount();
    return [insurers, count];
  }

  async findInsurersByIIN(iin: string) {
    return this.insurerRepository.find({ where: { adjudicatorIIN: iin } });
  }

  async getAll(): Promise<Insurer[]> {
    return await this.insurerRepository.find();
  }

  async findInsurerById(id: string, findRemoved = false): Promise<Insurer> {
    const insurer = await this.insurerRepository.findOne({
      withDeleted: findRemoved,
      where: {
        id,
      },
    });
    if (!insurer) {
      return null;
    }
    return insurer;
  }

  async deleteInsurer(id: string): Promise<SuccessResponse> {
    await this.insurerRepository.softDelete({ id });
    return new SuccessResponse(true);
  }

  count(): Promise<number> {
    return this.insurerRepository.count();
  }
}
