import { injectable, inject } from 'inversify';
import { Document } from 'mongoose';
import { ErrorCode, ErrorDescription } from '../../express/models/error';
import { TYPES } from '../../constants';
import { MongoDbService } from '../../services/mongodb';
import { GenericRepository } from '../generic';

export interface ErrorDescriptionModel extends ErrorDescription, Document {}; 

@injectable()
export class ErrorDescriptionRepository extends GenericRepository<ErrorDescription, ErrorDescriptionModel> {

    public constructor(
        @inject(TYPES.MongoDbService) mongodb: MongoDbService
    ) {
        super(mongodb, 'Error', {
            status: { type: Number, required: true },
            code: { type: String, required: true, unique: true },
            description: { type: String, required: true }
        });
    }

    public async findAllErrors(): Promise<ErrorDescription[]> {
        return await this.model.find();
    }

    public async findErrorByCode(code: ErrorCode): Promise<ErrorDescription | null> {
        return await this.model.findOne({ code });
    }

    public async createError(error: ErrorDescription): Promise<ErrorDescription> {
        return await this.model.create(error);
    }

    public async updateErrorById(id: string, error: ErrorDescription): Promise<ErrorDescription | null> {
        return await this.model.findOneAndUpdate({ id }, {
            ...error
        });
    }

    public async removeErrorById(id: string): Promise<ErrorDescription | null> {
        return await this.model.findOneAndDelete({ id });
    }

}
