import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { ConditionService } from '../condition/condition.service';
import { adminUser } from '../core/constants/base.constant';
import { conditions } from '../core/constants/base.constant';

@Injectable()
export class SeedService {

  constructor(
    private readonly userService: UserService,
    private readonly conditionService: ConditionService
  ) {
  }

  async seedAdminUser() {
    const userCount = await this.userService.count();
    if (userCount !== 0) {
      return;
    }
    await this.userService.createUser(adminUser);
  }

  async seedConditions() {
    const exist = await this.conditionService.getAll();
    if (exist.length) {
      return;
    }
    await this.conditionService.createCondition(conditions);
  }

}
