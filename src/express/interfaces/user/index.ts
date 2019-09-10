import { Request } from 'express';
import { User } from '../../../prisma'

export interface IUserRequest extends Request {
    user: User
}