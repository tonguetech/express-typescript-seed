import { injectable } from 'inversify';
import User, { IUser } from '../../models/user';

@injectable()
export class UserRepository {

    public constructor() {}

    public async findUserById(id: string): Promise<IUser | null> {
        const user: IUser | null = await User.findById(id);
        return user;
    }
}