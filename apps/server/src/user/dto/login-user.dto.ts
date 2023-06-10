import { IUser } from '@twitch-messaging/shared';
import { IsString } from 'class-validator';

export class LoginUserDto implements Pick<IUser, 'password' & 'username'> {
  @IsString()
  username: string;

  @IsString()
  password: string;

}
