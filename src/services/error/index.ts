import { injectable, inject } from 'inversify';
import { TYPES } from '../../constants';
import { IErrorDescription, ErrorCode } from '../../express/models/error';
import { ErrorDescriptionRepository } from '../../express/repository/error';

interface ErrorResponse {
    readonly status: number,
    readonly body: ErrorBody | ErrorBodyDebug
}

interface ErrorBody {
    readonly code: ErrorCode,
    readonly description: string,
}

interface ErrorBodyDebug {
    readonly code: ErrorCode,
    readonly description: string,
    readonly debug: string,
}

@injectable()
export class ErrorHandlerService {

    private errorRepo: ErrorDescriptionRepository;

    public constructor(
        @inject(TYPES.ErrorDescriptionRepository) errorRepo: ErrorDescriptionRepository
    ) {
        this.errorRepo = errorRepo;
    }

    public async getErrorResponse(error: Error): Promise<ErrorResponse> {
        const err = await this.getErrorDescription(error);
        if (!err) {
            return <ErrorResponse>{
                status: 500,
                body: <ErrorBodyDebug>{
                    code: 'ERR_CODE_NOT_PERSISTED_TO_DATABASE',
                    description: 'Error code not found in the database',
                    debug: error.message
                }
            };
        } else {
            const body: ErrorBody | ErrorBodyDebug = (process.env.NODE_ENV == 'development' && err.code !== "ERR_UNKNOWN")
                ? <ErrorBodyDebug>{
                    code: err.code,
                    description: err.description,
                    debug: error.stack
                } : <ErrorBody>{
                    code: err.code,
                    description: err.description,
                };
            return <ErrorResponse>{
                status: err.status,
                body,
            };
        }
    }

    private async getErrorDescription(error: Error): Promise<IErrorDescription | null> {
        switch (error.message) {
            case 'ERR_AUTH_FAILED':
                return await this.errorRepo.findErrorByCode('ERR_AUTH_FAILED');
            case 'ERR_INVALID_JWT':
                return await this.errorRepo.findErrorByCode('ERR_INVALID_JWT');
            case 'ERR_INVALID_PARMS':
                return await this.errorRepo.findErrorByCode('ERR_INVALID_PARMS');
            case 'ERR_INCORRECT_PASSWORD_RESET_TOKEN':
                return await this.errorRepo.findErrorByCode('ERR_INCORRECT_PASSWORD_RESET_TOKEN');
            case 'ERR_CATEGORY_NOT_FOUND':
                return await this.errorRepo.findErrorByCode('ERR_CATEGORY_NOT_FOUND');
            case 'ERR_DISTRICT_NOT_FOUND':
                return await this.errorRepo.findErrorByCode('ERR_DISTRICT_NOT_FOUND');
            case 'ERR_MERCHANT_NOT_FOUND':
                return await this.errorRepo.findErrorByCode('ERR_MERCHANT_NOT_FOUND');
            case 'ERR_ROOM_NOT_FOUND':
                return await this.errorRepo.findErrorByCode('ERR_ROOM_NOT_FOUND');
            case 'ERR_AHEAD_RESERVED_DATE':
                return await this.errorRepo.findErrorByCode('ERR_AHEAD_RESERVED_DATE');
            case 'ERR_EXCEED_MAX_BOOKING_SESSION':
                return await this.errorRepo.findErrorByCode('ERR_EXCEED_MAX_BOOKING_SESSION');
            case 'ERR_ROOM_IS_RESERVED':
                return await this.errorRepo.findErrorByCode('ERR_ROOM_IS_RESERVED');
            case 'ERR_CONSECUTIVE_BOOKING_NOT_ALLOWED':
                return await this.errorRepo.findErrorByCode('ERR_CONSECUTIVE_BOOKING_NOT_ALLOWED');
            case 'ERR_INVALID_START_TIME_OR_END_TIME':
                return await this.errorRepo.findErrorByCode('ERR_INVALID_START_TIME_OR_END_TIME');
            case 'ERR_TIMESLOT_NOT_FOUND':
                return await this.errorRepo.findErrorByCode('ERR_TIMESLOT_NOT_FOUND');
            case 'ERR_INVALID_PAYMENT_METHOD':
                return await this.errorRepo.findErrorByCode('ERR_INVALID_PAYMENT_METHOD');
            default:
                return <IErrorDescription>{
                    id: '',
                    status: 500,
                    code: 'ERR_UNKNOWN',
                    description: error.stack || 'Empty stacktrace'
                };
        }
    }
}
