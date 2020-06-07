import ErrorDescription, { IErrorDescription, ErrorCode } from '../../models/error';

export class ErrorDescriptionRepository {

    public constructor() {}

    public async findErrorByCode(code: ErrorCode): Promise<IErrorDescription | null> {
        const error: IErrorDescription | null = await ErrorDescription.findOne({ code });
        return error;
    }

}