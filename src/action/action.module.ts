import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { Action } from './entities/action.entity';

import { ActionController } from './action.controller';
import { ActionService } from './action.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Action])
  ],
  controllers: [ActionController],
  providers: [ActionService],
  exports: [ActionService]
})
export class ActionModule {}
