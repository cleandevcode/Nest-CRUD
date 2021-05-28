import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { getFromDto } from '../core/utils/repository.util';
import { SuccessResponse } from '../core/models/success-response';
import { College } from './entities/college.entity';
import { CollegeDto } from './dtos/college.dtos';

@Injectable()
export class CollegeService {
  constructor(
    @InjectRepository(College)
    private readonly collegeRepository: Repository<College>,
  ) {}

  async getAll(): Promise<College[]> {
    return await this.collegeRepository.find({});
  }

  async createCollege(body: CollegeDto, throwError = true): Promise<College> {
    const found = await this.findCollegeById(body.id);
    if (found) {
      if (throwError) {
        throw new BadRequestException(`Id is already taken.`);
      } else {
        return found;
      }
    }
    const college = getFromDto<College>(body, new College());
    const added = await this.collegeRepository.save(college);
    return this.findCollegeById(added.id);
  }

  async findCollegeById(id: string, findRemoved = false): Promise<College> {
    const college = await this.collegeRepository.findOne({
      withDeleted: findRemoved,
      where: {
        id,
      },
    });

    return college || null;
  }

  async findColleges(
    skip: number,
    take: number,
    keyword = '',
  ): Promise<[College[], number]> {
    return await this.collegeRepository
      .createQueryBuilder('college')
      .where('LOWER(college.name) like :keyword', {
        keyword: '%' + keyword.toLowerCase() + '%',
      })
      .addOrderBy('college.createdAt', 'ASC')
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async updateCollege(id: string, data: CollegeDto): Promise<College> {
    let college = await this.findCollegeById(id);
    if (!college) {
      throw new BadRequestException('Unable to update non-existing college.');
    }
    await this.collegeRepository.remove(college);
    college = getFromDto<College>(data, new College());
    await this.collegeRepository.save(college);
    return this.findCollegeById(college.id);
  }

  async deleteCollege(id: string): Promise<SuccessResponse> {
    await this.collegeRepository.softDelete({ id });
    return new SuccessResponse(true);
  }

  count(): Promise<number> {
    return this.collegeRepository.count();
  }
}
