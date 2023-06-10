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

import { AuthRoute } from '@twitch-messaging/shared';
import { UserForRegistrationRequestDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { UserForRegistrationResponseDto } from '../user/dto/response-create-user.dto copy';
import { LocalAuthGuard } from './guards/local-auth.guard';


@Controller(AuthRoute.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post(AuthRoute.SIGN_UP)
  async singUp(
    @Body() userDto: UserForRegistrationRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user: UserForRegistrationResponseDto = await this.authService.singUp(userDto);

    if (!(user?.refreshToken)) {
      throw new HttpException(
        'User under this username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  @Post(AuthRoute.SIGN_IN)
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
