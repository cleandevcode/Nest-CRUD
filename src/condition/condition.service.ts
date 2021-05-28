import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Condition } from './entities/condition.entity';

@Injectable()
export class ConditionService {
  constructor(
    @InjectRepository(Condition)
    private readonly conditionRepository: Repository<Condition>,
  ) {}

  async createCondition(conditions: string[]): Promise<string[]> {
    let found = await this.findFirst();
    if (found) {
      const originalConditions = found.conditions;
      let mergedConditions = originalConditions.concat(conditions);
      mergedConditions = [...new Set([...originalConditions, ...conditions])];
      found.conditions = mergedConditions;
    } else {
      found = new Condition();
      found.conditions = conditions;
    }
    const added = await this.conditionRepository.save(found);
    if (added) {
      return added.conditions;
    }
    return [];
  }

  async getAll(): Promise<string[]> {
    const found = await this.findFirst();
    if (found) {
      return found.conditions;
    }
    return [];
  }

  async findFirst(): Promise<Condition> {
    const conditions = await this.conditionRepository.find({
      order: {
        id: 'DESC',
      },
      take: 1,
    });
    if (!conditions) {
      return null;
    }
    return conditions[0];
  }
}
