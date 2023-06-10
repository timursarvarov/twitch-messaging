import { UserForSignUpReq } from '@twitch-messaging/shared';
import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto implements UserForSignUpReq {

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

}
