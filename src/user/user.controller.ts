import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';

import { UserService } from './user.service';
import { ActionService } from '../action/action.service';
import { User } from './entities/user.entity';
import { UserDto } from './dtos/user.dto';
import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { PaginatorDto } from '../core/dtos/paginator.dto';
import { TablePaginationDto } from '../core/dtos/table-pagination.dto';
import { defaultTakeCount } from '../core/constants/base.constant';
import { RolesGuard } from '../core/guards/roles.guard';
import { Roles } from '../core/decorators/roles.decorator';
import { UserRole } from '../core/enums/user';
import { SuccessResponse } from '../core/models/success-response';
import { ActionType, ActionContentType } from '../core/enums/action';
import { ActionReasonDto } from '../action/dtos/action.dto';

const ipaddr = require('ipaddr.js');

@ApiTags('User')
@Controller('api')
export class UserController {
  constructor(
    private userService: UserService,
    private actionService: ActionService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Post('users')
  @ApiOkResponse({ type: User })
  async create(
    @Request() request,
    @Body() body: UserDto,
    @Ip() ip: string,
  ): Promise<User> {
    const existing = await this.userService.findDeletedUserByEmail(body.email);

    let user;
    if (existing) {
      user = await this.userService.restoreSoftDeletedUser(
        existing.id,
        existing.toUserDto(),
      );
    } else {
      user = await this.userService.createUser(body);
    }
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: user.id,
        type: ActionType.Create,
        contentType: ActionContentType.User,
        content: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('users')
  @ApiOkResponse({ type: [User] })
  async clients(
    @Query() query: TablePaginationDto,
    @Request() request,
  ): Promise<PaginatorDto<User>> {
    let sortBy = query.sortBy;

    if (typeof query.sortBy === 'string') sortBy = [query.sortBy];

    const [data, count] = await this.userService.findUsers(
      query.skip || 0,
      query.take || defaultTakeCount,
      query.keyword || '',
      sortBy,
    );
    return { data, count };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('users/all')
  @ApiOkResponse({ type: [User] })
  async allUsers(@Request() request): Promise<User[]> {
    return this.userService.getAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: [User] })
  async userDetail(@Request() request, @Param('id') id): Promise<User> {
    return this.userService.findUserById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Delete('users/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  async delete(
    @Request() request,
    @Param('id') id,
    @Ip() ip: string,
    @Body() body: ActionReasonDto,
  ): Promise<SuccessResponse> {
    const user = await this.userService.findUserById(id);
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: user.id,
        type: ActionType.Delete,
        contentType: ActionContentType.User,
        content: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return await this.userService.deleteUser(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Put('users/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: User })
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() body: UserDto,
    @Ip() ip: string,
  ): Promise<User> {
    const user = await this.userService.updateUser(id, body);
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: user.id,
        type: ActionType.Update,
        contentType: ActionContentType.User,
        content: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return user;
  }
}
