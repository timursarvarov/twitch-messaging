

// import { IUser } from 'api-interface';
import { IUser } from '@twitch-messaging/api-params';
import { IsEmail, IsString } from 'class-validator';


export class ResponseCreateUserDto implements Omit<IUser, '_id'>  {

  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly accessToken?: string;

  @IsString()
  readonly refreshToken?: string;

}
