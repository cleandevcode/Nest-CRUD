import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clinic } from '../clinic/entities/clinic.entity';
import { Clinician } from './entities/clinician.entity';
import { ClinicianDto } from './dtos/clinician.dtos';
import { getFromDto, validateSortOption } from '../core/utils/repository.util';
import { SuccessResponse } from '../core/models/success-response';
import { ClinicianSortKey } from 'src/core/enums/clinician';
import { Repository } from 'typeorm';

@Injectable()
export class ClinicianService {
  constructor(
    @InjectRepository(Clinician)
    private readonly clinicianRepository: Repository<Clinician>,
    @InjectRepository(Clinic)
    private readonly clinicRepository: Repository<Clinic>,
  ) {}

  async createClinician(
    body: ClinicianDto,
    throwError = true,
  ): Promise<Clinician> {
    const found = await this.findClinicianById(body.id);
    if (found) {
      if (throwError) {
        throw new BadRequestException(`Id is already taken.`);
      } else {
        return found;
      }
    }
    const clinician = getFromDto<Clinician>(body, new Clinician());
    clinician.clinics = await this.clinicRepository.findByIds(body.clinics);
    const added = await this.clinicianRepository.save(clinician);
    return this.findClinicianById(added.id);
  }

  async updateClinician(
    clinicId: string,
    data: ClinicianDto,
  ): Promise<Clinician> {
    let clinician = await this.findClinicianById(clinicId);
    if (!clinician) {
      throw new BadRequestException('Unable to update non-existing clinician.');
    }
    clinician = getFromDto<Clinician>(data, clinician);
    clinician.clinics = await this.clinicRepository.findByIds(data.clinics);
    await this.clinicianRepository.save(clinician);
    return this.findClinicianById(clinician.id);
  }

  async findClinicians(
    skip: number,
    take: number,
    keyword = '',
    sortBy: string[] = [],
  ): Promise<[Clinician[], number]> {
    const orderQuery = {};
    let sortInfo;

    if (sortBy.length > 0) {
      sortBy.map((item) => {
        sortInfo = validateSortOption(ClinicianSortKey, item);

        switch (sortInfo.key) {
          case ClinicianSortKey.id:
            orderQuery['clinician.id'] = sortInfo.order;
            break;
          case ClinicianSortKey.name:
            orderQuery['clinician.firstName'] = sortInfo.order;
            break;
          case ClinicianSortKey.clinic:
            orderQuery['clinics.name'] = sortInfo.order;
            break;
          case ClinicianSortKey.CreateAt:
            orderQuery['clinician.createdAt'] = sortInfo.order;
            break;
          default:
            break;
        }
      });
    }

    return await this.clinicianRepository
      .createQueryBuilder('clinician')
      .leftJoinAndSelect('clinician.clinics', 'clinics')
      .where('clinician.firstName ilike :keyword', { keyword: `%${keyword}%` })
      .orWhere('clinician.middleName ilike :keyword', {
        keyword: `%${keyword}%`,
      })
      .orWhere('clinician.lastName ilike :keyword', { keyword: `%${keyword}%` })
      .orWhere('clinician.id ilike :keyword', { keyword: `%${keyword}%` })
      .orWhere('clinician.phone ilike :keyword', { keyword: `%${keyword}%` })
      .orderBy(orderQuery)
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async findClinicianById(id: string, findRemoved = false): Promise<Clinician> {
    const clinician = await this.clinicianRepository.findOne({
      withDeleted: findRemoved,
      relations: ['clinics'],
      where: {
        id,
      },
    });
    if (!clinician) {
      return null;
    }
    return clinician;
  }

  async getAll(): Promise<Clinician[]> {
    return await this.clinicianRepository.find({
      relations: ['clinics'],
    });
  }

  count(): Promise<number> {
    return this.clinicianRepository.count();
  }

  async deleteClinician(id: string): Promise<SuccessResponse> {
    await this.clinicianRepository.softDelete({ id });
    return new SuccessResponse(true);
  }
}
