import { Request } from 'express';
import { IUser } from '../../../express/models/user'

export interface IUserRequest extends Request {
    user: IUser
}