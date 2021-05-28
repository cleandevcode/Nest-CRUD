import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Action } from './entities/action.entity';
import { User } from '../user/entities/user.entity';
import { ActionDto, LatestActionDto } from './dtos/action.dto';
import { getFromDto, validateSortOption } from '../core/utils/repository.util';
import { ActionContentType, ActionSortKey } from '../core/enums/action';
import { SortOrder } from 'src/core/enums/base';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createAction(body: ActionDto, ipAddress = null): Promise<Action> {
    const data = {
      ...body,
      order:
        body.contentType === ActionContentType.Claim ? body.content.id : null,
      ipAddress,
    };
    const action = getFromDto<Action>(data, new Action());
    const added = await this.actionRepository.save(action);
    return this.findActionById(added.id);
  }

  async findActions(
    skip: number,
    take: number,
    keyword = '',
    staff: string,
    sortBy: string[] = [],
    contentType: ActionContentType[],
    startDate: Date,
    endDate: Date,
  ): Promise<[Action[], number]> {
    const whereClause = `("contentType"::text ilike :keyword)`;
    // const whereClause = `(type::text ilike :keyword or "contentType"::text ilike :keyword)`;

    const orderQuery = {};
    let sortInfo;

    if (sortBy.length > 0) {
      sortBy.map((item) => {
        sortInfo = validateSortOption(ActionSortKey, item);

        switch (sortInfo.key) {
          case ActionSortKey.id:
            orderQuery['log.id'] = sortInfo.order;
            break;
          case ActionSortKey.time:
            orderQuery['log.updatedAt'] = sortInfo.order;
            break;
          case ActionSortKey.action:
            orderQuery['log.type'] = sortInfo.order;
            break;
          case ActionSortKey.ip:
            orderQuery['log.ipAddress'] = sortInfo.order;
            break;
          case ActionSortKey.staff:
            orderQuery['user.lastName'] = sortInfo.order;
            break;
          case ActionSortKey.type:
            orderQuery['log.contentType'] = sortInfo.order;
            break;
          default:
            break;
        }
      });
    } else {
      orderQuery['log.updatedAt'] = SortOrder.Asc;
    }

    return await this.actionRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user')
      .where(staff === '' ? staff : `log.user = '${staff}'`)
      .andWhere(whereClause, { keyword: `%${keyword}%` })
      .andWhere('log.contentType IN (:...contentType)', { contentType })
      .andWhere(
        `log.createdAt BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
      )
      .orderBy(orderQuery)
      .skip(skip)
      .take(take)
      .leftJoinAndSelect('log.order', 'claim')
      .leftJoinAndSelect('claim.carts', 'carts')
      .leftJoinAndSelect('carts.product', 'product')
      .getManyAndCount();
  }

  async findActionsByKeyword(keyword: string): Promise<Action[]> {
    const whereClause = `(log.id::text ilike :keyword or type::text ilike :keyword or "contentType"::text ilike :keyword or content->>'id' ilike :keyword or content->>'name' ilike :keyword or content->>'pin' ilike :keyword)`;
    return await this.actionRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user')
      .andWhere(whereClause, { keyword: `%${keyword}%` })
      .addOrderBy('log.createdAt', 'DESC')
      .leftJoinAndSelect('log.order', 'claim')
      .limit(3)
      .getMany();
  }

  async findActionById(id: string, findRemoved = false): Promise<Action> {
    const action = await this.actionRepository.findOne({
      withDeleted: findRemoved,
      relations: ['user'],
      where: {
        id,
      },
    });
    if (!action) {
      return null;
    }
    return action;
  }

  async getLatestActions(): Promise<LatestActionDto> {
    const clinicLog = await this.actionRepository.findOne({
      where: { contentType: ActionContentType.Clinic },
      order: { updatedAt: 'DESC' },
    });
    const clinicianLog = await this.actionRepository.findOne({
      where: { contentType: ActionContentType.Clinician },
      order: { updatedAt: 'DESC' },
    });
    const userLog = await this.actionRepository.findOne({
      where: { contentType: ActionContentType.User },
      order: { updatedAt: 'DESC' },
    });
    const insurerLog = await this.actionRepository.findOne({
      where: { contentType: ActionContentType.Insurer },
      order: { updatedAt: 'DESC' },
    });

    return { userLog, clinicLog, clinicianLog, insurerLog };
  }
}
