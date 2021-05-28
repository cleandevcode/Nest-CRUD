import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Clinic } from './entities/clinic.entity';
import { ClinicDto } from './dtos/clinic.dtos';
import { getFromDto, validateSortOption } from '../core/utils/repository.util';
import { SuccessResponse } from '../core/models/success-response';
import { ClinicSortKey } from 'src/core/enums/clinic';
import { SortOrder } from 'src/core/enums/base';

@Injectable()
export class ClinicService {
  constructor(
    @InjectRepository(Clinic)
    private readonly clinicRepository: Repository<Clinic>,
  ) {}

  async createClinic(body: ClinicDto, throwError = true): Promise<Clinic> {
    const found = await this.findClinicById(body.id);
    if (found) {
      if (throwError) {
        throw new BadRequestException(`Id is already taken.`);
      } else {
        return found;
      }
    }
    const clinic = getFromDto<Clinic>(body, new Clinic());
    const added = await this.clinicRepository.save(clinic);
    return this.findClinicById(added.id);
  }

  async updateClinic(clinicId: string, data: ClinicDto): Promise<Clinic> {
    let clinic = await this.findClinicById(clinicId);
    if (!clinic) {
      throw new BadRequestException('Unable to update non-existing clinic.');
    }
    clinic = getFromDto<Clinic>(data, clinic);
    clinic.id = clinicId;
    const updated = await this.clinicRepository.save(clinic);
    return this.findClinicById(updated.id);
  }

  async findClinics(
    skip: number,
    take: number,
    keyword = '',
    sortBy: string[] = [],
  ): Promise<[Clinic[], number]> {
    const orderQuery = {};
    let sortInfo;

    if (sortBy.length > 0) {
      sortBy.map((item) => {
        sortInfo = validateSortOption(ClinicSortKey, item);

        switch (sortInfo.key) {
          case ClinicSortKey.id:
            orderQuery['clinic.id'] = sortInfo.order;
            break;
          case ClinicSortKey.name:
            orderQuery['clinic.name'] = sortInfo.order;
            break;
          case ClinicSortKey.address:
            orderQuery['clinic.address'] = sortInfo.order;
            break;
          case ClinicSortKey.CreateAt:
            orderQuery['clinic.createdAt'] = sortInfo.order;
            break;
          default:
            break;
        }
      });
    } else {
      orderQuery['clinic.createdAt'] = SortOrder.Desc;
    }

    return await this.clinicRepository
      .createQueryBuilder('clinic')
      .where('clinic.name ilike :keyword', { keyword: `%${keyword}%` })
      .orderBy(orderQuery)
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async getAll(): Promise<Clinic[]> {
    return await this.clinicRepository.find();
  }

  async findClinicById(id: string, findRemoved = false): Promise<Clinic> {
    const clinic = await this.clinicRepository.findOne({
      withDeleted: findRemoved,
      where: {
        id,
      },
    });
    if (!clinic) {
      return null;
    }
    return clinic;
  }

  count(): Promise<number> {
    return this.clinicRepository.count();
  }

  async deleteClinic(id: string): Promise<SuccessResponse> {
    await this.clinicRepository.softDelete({ id });
    return new SuccessResponse(true);
  }
}
