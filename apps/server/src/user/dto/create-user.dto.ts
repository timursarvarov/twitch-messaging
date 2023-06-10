

// import { IUser } from 'api-interface';
import { IUser } from '@twitch-messaging/shared';
import { IsEmail, IsString } from 'class-validator';


export class CreateUserDto implements Omit<IUser, '_id'>  {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;

  @IsEmail()
  readonly email: string;

}
