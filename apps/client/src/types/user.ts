import axios from 'axios';
import { Decoder, nullable, object, string } from 'decoders';
import { loadUser } from '../components/App/App.slice';
import { store } from '../state/store';

export interface PublicUser {
  username: string;
}

export interface User extends PublicUser {
  email: string;
  accessToken: string;
  refreshToken: string;
}

export const userDecoder: Decoder<User> = object({
  email: string,
  accessToken: string,
  refreshToken: string,
  username: string,
});

export interface UserSettings extends PublicUser {
  email: string;
  password: string | null;
}

export interface UserForRegistration {
  email: string;
  username: string;
  password: string;
}

export function loadUserIntoApp(user: User) {
  localStorage.setItem('accessToken', user.accessToken);
  axios.defaults.headers.Authorization = `Token ${user.accessToken}`;
  store.dispatch(loadUser(user));
}
