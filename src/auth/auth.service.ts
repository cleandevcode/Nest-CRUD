import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { TokenResponse } from '../core/models/auth';
import { LoginDto } from '../user/dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(email: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      return user;
    }
    return null;
  }

  async validateLoginDto(loginDto: LoginDto): Promise<LoginDto> {
    const { email, msToken } = loginDto;

    try {
      const decoded: any = this.jwtService.decode(msToken);
      if (!decoded) throw new Error('Invalid token!');

      if (decoded && !decoded.preferred_username)
        throw new Error('Invalid token!');

      if (
        decoded &&
        decoded.preferred_username &&
        decoded.preferred_username !== email
      )
        throw new Error('Invalid MS account!');

      return loginDto;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async createUser(payload: LoginDto): Promise<User> {
    const user = await this.userService.createUser(payload);
    if (user) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<TokenResponse> {
    const payload = {
      email: user.email,
      role: user.role,
      id: user.id,
      userRole: user.userRole,
    };
    const accessToken = this.jwtService.sign(payload);
    await this.userService.updateUser(user.id, {
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      active: true,
      lastLogin: new Date(),
    });
    return { accessToken };
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userService.findUserByEmail(email);
  }
}
