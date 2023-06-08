import axios from 'axios';
import { object } from 'decoders';
import settings from '../config/settings';

import { GenericErrors, genericErrorsDecoder } from '../types/error';

import { User, UserForRegistration, userDecoder } from '../types/user';

axios.defaults.baseURL = settings.baseApiUrl;


export async function login(email: string, password: string): Promise<User | GenericErrors> {
  try {
    const { data } = await axios.post('users/login', { user: { email, password } });

    return object({ user: userDecoder }).verify(data).user;
  } catch ({ response: { data } }: any) {
    return object({ errors: genericErrorsDecoder }).verify(data).errors;
  }
}

export async function signUp(user: UserForRegistration): Promise<User | GenericErrors> {
  try {
    const { data } = await axios.post('/auth/signup', { ...user });

    console.log(data)

    return object({ user: userDecoder }).verify({ user: data }).user;
  } catch (err) {
    console.log(err)
    return object({ errors: genericErrorsDecoder }).verify(err).errors;
  }
}

export async function getUser(): Promise<User> {
  const rowUser = await localStorage.getItem('user')
  const data = rowUser && JSON.parse(rowUser);
  return object({ user: userDecoder }).verify(data).user;
}
