import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getFromDto } from 'src/core/utils/repository.util';
import { Repository } from 'typeorm';
import { AdjudicationInterfaceDto } from './dtos/adjudication.dto';
import { Adjudication } from './entities/adjudication.entity';

@Injectable()
export class AdjudicationService {
  constructor(
    @InjectRepository(Adjudication)
    private readonly repository: Repository<Adjudication>,
  ) {}

  async create(data: AdjudicationInterfaceDto) {
    const adjudication = getFromDto<Adjudication>(data, new Adjudication());
    const added = await this.repository.save(adjudication);

    return this.repository.findOne({
      where: { traceNumber: added.traceNumber },
    });
  }
}
