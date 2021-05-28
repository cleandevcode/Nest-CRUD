import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getFromDto, validateSortOption } from '../core/utils/repository.util';
import { UserRole, UserSortKey } from '../core/enums/user';
import { SuccessResponse } from '../core/models/success-response';
import { SortOrder } from 'src/core/enums/base';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(body: any, throwError = true): Promise<User> {
    const found = await this.findUserByEmail(body.email);
    if (found) {
      if (throwError) {
        throw new BadRequestException(`Email is already taken.`);
      } else {
        return found;
      }
    }
    const user = getFromDto<User>(body, new User());
    if (!body.role) {
      user.role = UserRole.Staff;
    }
    const added = await this.userRepository.save(user);
    return this.findUserByEmail(added.email);
  }

  async updateUser(userId: string, body: any): Promise<User> {
    let user = await this.findUserById(userId);
    if (!user) {
      throw new BadRequestException('Unable to update non-existing user.');
    }
    user = getFromDto<User>(body, user);
    user.id = userId;
    await this.userRepository.save(user);
    return this.findUserById(user.id);
  }

  async findUsers(
    skip: number,
    take: number,
    keyword = '',
    sortBy: string[] = [],
  ): Promise<[User[], number]> {
    const orderQuery = {};
    let sortInfo;

    if (sortBy.length > 0) {
      sortBy.map((item) => {
        sortInfo = validateSortOption(UserSortKey, item);
        switch (sortInfo.key) {
          case UserSortKey.Id:
            orderQuery['user.id'] = sortInfo.order;
            break;
          case UserSortKey.CreateAt:
            orderQuery['user.createdAt'] = sortInfo.order;
            break;
          case UserSortKey.role:
            orderQuery['user.role'] = sortInfo.order;
            break;
          case UserSortKey.name:
            orderQuery['user.firstName'] = sortInfo.order;
            break;
          case UserSortKey.lastLogin:
            orderQuery['user.lastLogin'] = sortInfo.order;
            break;
          default:
            break;
        }
      });
    } else {
      orderQuery['user.createdAt'] = SortOrder.Desc;
    }

    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.firstName ilike :keyword', { keyword: `%${keyword}%` })
      .orWhere('user.lastName ilike :keyword', { keyword: `%${keyword}%` })
      .orderBy(orderQuery)
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  findUserByEmail(email: string, findRemoved = false): Promise<User> {
    if (!email) {
      return null;
    }
    return this.userRepository.findOne({
      withDeleted: findRemoved,
      where: { email: email.toLowerCase() },
    });
  }

  async findUserById(id: string, findRemoved = false): Promise<User> {
    const user = await this.userRepository.findOne({
      withDeleted: findRemoved,
      where: {
        id,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async deleteUser(id: string): Promise<SuccessResponse> {
    await this.userRepository.softDelete({ id });
    return new SuccessResponse(true);
  }

  async findDeletedUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      withDeleted: true,
      where: { email },
    });
  }

  async restoreSoftDeletedUser(id: string, userDto: UserDto) {
    let user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!user) {
      throw new BadRequestException('Unable to update non-existing user.');
    }

    user = getFromDto<User>(userDto, user);
    user.id = id;
    user.deletedAt = null;
    await this.userRepository.save(user);
    return this.findUserById(user.id);
  }

  count(): Promise<number> {
    return this.userRepository.count();
  }
}
