import _ from 'lodash';
import { injectable, inject } from 'inversify';
import { Document } from 'mongoose';
import { IUser } from '../../express/models/user';
import { TYPES } from '../../constants';
import { GenericRepository } from '../generic';
import { MongoDbService } from '../../services/mongodb';

export interface UserModel extends IUser, Document {};

@injectable()
export class UserRepository extends GenericRepository<IUser, UserModel> {

    public constructor(
        @inject(TYPES.MongoDbService) mongodb: MongoDbService
    ) {
        super(mongodb, 'User', {
            billingCardBrand: { type: String },
            billingCardExpMonth: { type: String },
            billingCardExpYear: { type: String },
            billingCardLast4: { type: String },
            email: { type: String, required: true, unique: true },
            emailChangeCandidate: { type: String },
            emailProofToken: { type: String },
            emailProofTokenExpiresAt: { type: Number },
            emailStatus: { type: String },
            facebookId: { type: String, unique: true },
            fullName: { type: String },
            googleId: { type: String, unique: true },
            hasBillingCard: { type: Boolean },
            password: { type: String },
            passwordResetToken: { type: String },
            passwordResetTokenExpiresAt: { type: Number },
            role: { type: String },
            stripeCustomerId: { type: String, unique: true },
            telephone: { type: Number },
            tosAcceptedByIp: { type: String },
            username: { type: String, required: true, unique: true }
        });
    }

    public async findUserById(id: string): Promise<IUser | null> {
        return await this.findById(id);
    }

    public async findUserByEmail(email: string): Promise<IUser | null> {
        return await this.model.findOne({ email });
    }

    public async findUserByFacebookId(facebookId: string): Promise<IUser | null> {
        return await this.model.findOne({ facebookId });
    }

    public async createNewUser(user: IUser) {
        return await this.create(user);
    }

    public async updateCredentialsByFacebookId(facebookId: string, username: string, hashedPassword: string): Promise<IUser | null> {
        return await this.model.findOneAndUpdate({ facebookId }, {
            username,
            password: hashedPassword
        });
    }

    public async updateEmailAndFacebookIdById(id: string, facebookId: string, email?: string): Promise<IUser | null> {
        return await this.model.findOneAndUpdate({ id }, {
            facebookId,
            email
        });
    }

}