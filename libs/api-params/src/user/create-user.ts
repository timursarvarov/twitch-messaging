import { IUser } from './user.interface';


export interface ICreateUser {
  req: Pick<IUser, 'password' & 'username'>
  res: IUser
}

export const SIGNUP_ROUTE = '/signup'


