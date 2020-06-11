import { injectable } from 'inversify';
import User, { IUser } from '../../models/user';

@injectable()
export class UserRepository {

    public constructor() {}

    public async findUserById(id: string): Promise<IUser | null> {
        const user: IUser | null = await User.findById(id);
        return user;
    }

    public async findUserByEmail(email: string): Promise<IUser | null> {
        const user: IUser | null = await User.findOne({ email });
        return user;
    }

    public async findUserByFacebookId(facebookId: string): Promise<IUser | null> {
        const user: IUser | null = await User.findOne({ facebookId });
        return user;
    }

    public async updateCredentialsByFacebookId(facebookId: string, username: string, password: string): Promise<IUser | null> {
        const updatedUser = await User.findOneAndUpdate({ facebookId }, {
            username,
            password, // of course hashed
        });
        return updatedUser;
    }

    public async createNewUser(user: IUser): Promise<IUser> {
        const newUser = await User.create(user);
        return newUser;
    }
}