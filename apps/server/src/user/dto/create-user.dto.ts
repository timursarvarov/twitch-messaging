

// import { IUser } from 'api-interface';
import { UserForSignUpReq } from '@twitch-messaging/shared';
import { IsEmail, IsString } from 'class-validator';


export class UserForRegistrationRequestDto implements UserForSignUpReq {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;

  @IsEmail()
  readonly email: string;

}
