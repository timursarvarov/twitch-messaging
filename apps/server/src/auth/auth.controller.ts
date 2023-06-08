import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UseGuards
} from '@nestjs/common';

import { Response } from 'express';

import { AuthService } from './auth.service';

import { SIGN_IN_ROUTE, SIGNUP_ROUTE } from '@twitch-messaging/api-params';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { ResponseCreateUserDto } from '../user/dto/response-create-user.dto copy';
import { LocalAuthGuard } from './guards/local-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post(SIGNUP_ROUTE)
  async singUp(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user: ResponseCreateUserDto = await this.authService.singUp(userDto);

    if (!(user?.refreshToken)) {
      throw new HttpException(
        'User under this username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    res.cookie('refreshToken', user.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return user;
  }

  @Post(SIGN_IN_ROUTE)
  @UseGuards(LocalAuthGuard)
  async singIn(
    @Body() userDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signIn(userDto);

    res.cookie('refreshToken', tokens?.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return tokens;
  }
}
