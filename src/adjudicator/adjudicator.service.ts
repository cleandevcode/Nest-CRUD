import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Validator } from 'node-input-validator';

import { Adjudicator } from './entities/adjudicator.entity';
import { getFromDto } from '../core/utils/repository.util';
import { AdjudicatorContentDto } from './dtos/adjudicator.dto';
import { SuccessResponse } from '../core/models/success-response';

@Injectable()
export class AdjudicatorService {
  constructor(
    @InjectRepository(Adjudicator)
    private readonly adjudicatorRepository: Repository<Adjudicator>,
  ) {}

  async create(adjudicatorDto: AdjudicatorContentDto): Promise<Adjudicator> {
    const validator = new Validator(
      { iin: adjudicatorDto.iinNumber },
      {
        iin: ['required', 'length:6', 'regex:[0-9]{6}'],
      },
    );

    return validator
      .check()
      .then(async (matched) => {
        if (!matched) {
          switch (validator.errors.iin.rule) {
            case 'length':
              throw new BadRequestException('IIN Number should be 6 length');
              break;
            case 'regex':
              throw new BadRequestException(
                'IIN number should be 6 digit string',
              );
              break;
            case 'required':
              throw new BadRequestException('IIN Number is required');
              break;
            default:
              throw new BadRequestException('Invalid IIN Number');
              break;
          }
        }
      })
      .then(async () => {
        const adjudicator = getFromDto<Adjudicator>(
          adjudicatorDto,
          new Adjudicator(),
        );
        const added = await this.adjudicatorRepository.save(adjudicator);

        return this.findAdjudicatorById(added.id);
      });
  }

  async getAll(): Promise<Adjudicator[]> {
    return this.adjudicatorRepository.find();
  }

  async findAdjudicatorById(id: string): Promise<Adjudicator> {
    const adjudicator = await this.adjudicatorRepository.findOne({
      where: { id },
    });
    if (!adjudicator) {
      throw new BadRequestException('Could not find requested adjudicator.');
    }
    return adjudicator;
  }

  async findAdjudicatorByIINNumber(iin: string): Promise<Adjudicator> {
    const adjudicator = await this.adjudicatorRepository.findOne({
      where: { iinNumber: iin },
    });
    if (!adjudicator) {
      throw new BadRequestException('Could not find requested adjudicator.');
    }
    return adjudicator;
  }

  async deleteAdjudicator(id: string): Promise<SuccessResponse> {
    await this.adjudicatorRepository.softDelete({ id }).catch((err) => {
      console.log(err);
    });
    return new SuccessResponse(true);
  }
}
