import { ObjectId } from 'typeorm';

export type IUser = {
	_id: string | ObjectId;
	username: string;
	password: string;
	email: string;
	accessToken?: string;
	refreshToken?: string;
}

export interface UserForSignUpReq extends Omit<IUser, 'password' | '_id' | 'accessToken' | 'refreshToken'> { }

export interface UserForMessageRes extends Omit<IUser, 'password' | '_id'> {
	userId: string;
}

export interface UserForSignUpRes extends Omit<IUser, 'password'> { }

export const enum AuthRoute {
	SIGN_UP = '/signup',
	SIGN_IN = '/signin',
	AUTH_SIGN_UP = '/auth/signup',
	AUTH_SIGN_IN = '/auth/signin',
	AUTH = '/auth',
}