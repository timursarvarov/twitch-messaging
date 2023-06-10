

// import { IUser } from 'api-interface';
import { UserForSignUpRes } from '@twitch-messaging/shared';
import { IsEmail, IsString } from 'class-validator';


export class UserForRegistrationResponseDto implements UserForSignUpRes {

  @IsString()
  _id: string;

  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly accessToken?: string;

  @IsString()
  readonly refreshToken?: string;

}
