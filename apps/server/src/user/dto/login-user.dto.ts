import { UserForSignUpReq } from '@twitch-messaging/shared';
import { IsString } from 'class-validator';

export class LoginUserDto implements UserForSignUpReq {
  @IsString()
  username: string;

  @IsString()
  password: string;

}
