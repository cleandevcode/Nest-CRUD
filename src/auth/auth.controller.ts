import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UnauthorizedException,
  Ip,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { ActionService } from '../action/action.service';
import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { TokenResponse } from '../core/models/auth';
import { User } from '../user/entities/user.entity';
import { LoginDto } from '../user/dtos/login.dto';
import { UserDto } from 'src/user/dtos/user.dto';
import { ActionType, ActionContentType } from '../core/enums/action';
import { SuccessResponse } from '../core/models/success-response';
import { UserRole } from '../core/enums/user';
import { FileInterceptor } from '@nestjs/platform-express';

const ipaddr = require('ipaddr.js');

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private actionService: ActionService,
  ) {}

  @ApiOkResponse({ type: TokenResponse })
  @Post('login')
  @UseInterceptors(FileInterceptor('image'))
  async login(@Body() body: LoginDto, @UploadedFile() file, @Ip() ip: string) {
    if (!body.firstName || !body.lastName)
      throw new BadRequestException('Please provide first name and last name');

    if (!body.msToken || body.msToken === '')
      throw new BadRequestException('Microsoft Access Token required!');

    const vaildLoginDto = await this.authService.validateLoginDto(body);

    const user = await this.authService.validateUser(vaildLoginDto.email);

    if (!user) {
      throw new BadRequestException('Non-registered User!');
    }

    if (user.role === UserRole.Admin) return { accessToken: null };
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: user.id,
        user: user.id,
        type: ActionType.Update,
        contentType: ActionContentType.Login,
        content: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          reason: 'LogIn',
        },
      },
      ipAddress.octets.join('.'),
    );

    user['firstName'] = body.firstName;
    user['lastName'] = body.lastName;
    user['image'] = body.image;
    user['userRole'] = user.role;

    return this.authService.login(user);
  }

  @ApiOkResponse({ type: TokenResponse })
  @Post('confirmrole')
  async confirmUserRole(@Body() body: LoginDto, @Ip() ip: string) {
    if (!body.role) throw new BadRequestException('Please select user role');

    if (!body.firstName || !body.lastName)
      throw new BadRequestException('Please provide first name and last name');

    if (!body.msToken || body.msToken === '')
      throw new BadRequestException('Microsoft Access Token required!');

    const ipAddress = ipaddr.process(ip);
    const vaildLoginDto = await this.authService.validateLoginDto(body);

    const user = await this.authService.validateUser(vaildLoginDto.email);

    await this.actionService.createAction(
      {
        id: user.id,
        user: user.id,
        type: ActionType.Update,
        contentType: ActionContentType.Login,
        content: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          reason: 'LogIn',
        },
      },
      ipAddress.octets.join('.'),
    );

    user['userRole'] = user.role;
    user['role'] = body.role;
    user['firstName'] = body.firstName;
    user['lastName'] = body.lastName;

    return this.authService.login(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserDto })
  @Get('profile')
  async getProfile(@Request() req): Promise<UserDto> {
    const email = req.user.email;
    const user: User = await this.authService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        `Invalid user authorization token found.`,
      );
    }
    return user.toUserDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: SuccessResponse })
  @Get('logout')
  async logout(@Request() req, @Ip() ip: string): Promise<SuccessResponse> {
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: req.user.id,
        user: req.user.id,
        type: ActionType.Update,
        contentType: ActionContentType.Logout,
        content: {
          id: req.user.id,
          name: `${req.user.firstName} ${req.user.lastName}`,
          reason: 'LogOut',
        },
      },
      ipAddress.octets.join('.'),
    );
    return {
      success: true,
    };
  }
}
