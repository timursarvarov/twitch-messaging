import { IUser } from './user.interface';


export interface ILoginUser {
  req: Pick<IUser, 'password' & 'username'>
  res: IUser
}

export const SIGN_IN_ROUTE = '/signin'