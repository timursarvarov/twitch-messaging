import { UserForSignUpRes } from '@twitch-messaging/shared';

import { Decoder, object, string } from 'decoders';

export const userDecoder: Decoder<UserForSignUpRes> = object({
  _id: string,
  username: string,
  email: string,
  accessToken: string,
  refreshToken: string,
});
