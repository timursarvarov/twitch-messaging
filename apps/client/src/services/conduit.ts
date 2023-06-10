import axios from 'axios';
import { object } from 'decoders';
import settings from '../config/settings';

import { GenericErrors, genericErrorsDecoder } from '../types/error';

import { AuthRoute, IUser, UserForSignUpReq, UserForSignUpRes } from '@twitch-messaging/shared';
import { loadUser } from '../components/App/App.slice';
import { store } from '../state/store';
import { userDecoder } from '../types/user';

axios.defaults.baseURL = settings.baseApiUrl;


export async function login(email: string, password: string): Promise<UserForSignUpRes | GenericErrors> {
  try {
    const { data } = await axios.post(AuthRoute.AUTH_SIGN_IN, { user: { email, password } });

    return object({ user: userDecoder }).verify(data).user;
  } catch ({ response: { data } }: any) {
    return object({ errors: genericErrorsDecoder }).verify(data).errors;
  }
}

export async function signUp(user: UserForSignUpReq): Promise<UserForSignUpRes | GenericErrors> {
  try {
    const { data } = await axios.post(AuthRoute.AUTH_SIGN_UP, user);
    localStorage.setItem('user', JSON.stringify(data))
    localStorage.setItem('token', JSON.stringify(data.accessToken))
    return object({ user: userDecoder }).verify({ user: data }).user;
  } catch (err) {
    return object({ errors: genericErrorsDecoder }).verify(err).errors;
  }
}

export async function getUser(): Promise<UserForSignUpRes> {
  const rowUser = await localStorage.getItem('user')
  const data = rowUser && JSON.parse(rowUser);
  return object({ user: userDecoder }).verify({user: data}).user;
}



export function loadUserIntoApp(user: IUser) {
  if (!user.accessToken) {
    return new Error('No access token found');
  }
  localStorage.setItem('accessToken', user.accessToken);
  axios.defaults.headers.Authorization = `Token ${user.accessToken}`;
  store.dispatch(loadUser(user));
}
