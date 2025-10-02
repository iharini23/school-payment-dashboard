import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const sanitized = user.toObject<{ password?: string }>();
    delete sanitized.password;
    return sanitized;
  }

  async login({ username, password }: LoginDto) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userId = user._id instanceof Types.ObjectId ? user._id.toHexString() : String(user._id);

    const payload = {
      username: user.username,
      sub: userId,
    };

    const expiresIn = this.configService.get<string>('JWT_EXPIRY');

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn,
      }),
    };
  }
}
