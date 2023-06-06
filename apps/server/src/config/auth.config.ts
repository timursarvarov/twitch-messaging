import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import validateConfig from '../utils/validate-config';
import { AuthConfig } from './config.type';


class EnvironmentVariablesValidator {
  @IsString()
  AUTH_JWT_SECRET: string;

  @IsString()
  AUTH_JWT_TOKEN_EXPIRES_IN: string;

  @IsString()
  AUTH_JWT_REFRESH_SECRET: string;

  @IsString()
  AUTH_JWT_TOKEN_REFRESH_EXPIRES_IN: string;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    secret: process.env.AUTH_JWT_SECRET,
    expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
    refreshSecret: process.env.AUTH_JWT_REFRESH_SECRET,
    refreshExpires: process.env.AUTH_JWT_TOKEN_REFRESH_EXPIRES_IN,
  };
});
