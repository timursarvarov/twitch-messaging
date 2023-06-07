import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async singUp(userDto: CreateUserDto) {
    const candidate = await this.userService.findOneByUsername(
      userDto.username,
    );

    if (candidate) return null;

    const hashedPassword = await bcrypt.hash(userDto.password, 7);
    const user = await this.userService.create({
      ...userDto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user._id.toString());

    return tokens;
  }

  async signIn(userDto: LoginUserDto) {
    const user = await this.userService.findOneByUsername(userDto.username);

    const tokens = await this.generateTokens(user._id.toString());

    return tokens;
  }

  async validateUser(userDto: LoginUserDto): Promise<User> {
    const user = await this.userService.findOneByUsername(userDto.username);

    if (!user) {
      throw new NotFoundException(`There is no user under this username`);
    }

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (passwordEquals) return user;

    throw new UnauthorizedException({ message: 'Incorrect password' });
  }

  verifyAccessToken(accessToken: string) {
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: this.configService.get('auth.secret'),
      });

      return payload;
    } catch (err) {
      return null;
    }
  }

  verifyRefreshToken(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('auth.refreshSecret'),
    });

    return payload;
  }

  async updateAccessToken(refreshToken: string) {
    try {
      const userId = this.verifyRefreshToken(refreshToken);

      const tokens = await this.generateTokens(userId);

      return tokens.accessToken;
    } catch (e) {
      return null;
    }
  }

  private async generateTokens(id: string) {
    const payload = { id };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('auth.secret'),
      expiresIn: this.configService.get('auth.expires'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('auth.refreshSecret'),
      expiresIn: this.configService.get('auth.refreshExpires')
    });
    const tokens = { accessToken, refreshToken };

    return tokens;
  }
}
