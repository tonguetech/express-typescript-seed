import ErrorDescription, { IErrorDescription, ErrorCode } from '../../models/error';

export class ErrorDescriptionRepository {

    public constructor() {}

    public async findAllErrors(): Promise<IErrorDescription[]> {
        const errors: IErrorDescription[] = await ErrorDescription.find();
        return errors;
    }

    public async findErrorByCode(code: ErrorCode): Promise<IErrorDescription | null> {
        const error: IErrorDescription | null = await ErrorDescription.findOne({ code });
        return error;
    }

    public async createError(error: IErrorDescription): Promise<IErrorDescription> {
        const newError: IErrorDescription = await ErrorDescription.create(error);
        return newError;
    }

    public async updateErrorById(id: string, error: IErrorDescription): Promise<IErrorDescription | null> {
        const updatedError: IErrorDescription | null = await ErrorDescription.findOneAndUpdate({ id }, {
            ...error
        });
        return updatedError;
    }

    public async removeErrorById(id: string): Promise<IErrorDescription | null> {
        return await ErrorDescription.findOneAndDelete({ id });
    }

}