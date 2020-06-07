import { inject, injectable } from 'inversify';
import { Response, NextFunction } from 'express';
import { Logger } from 'winston';
import { BaseMiddleware } from 'inversify-express-utils';
import { TYPES } from '../../constants';
import { JsonWebTokenService } from '../../services/jwt';
import { UserRepository } from '../repository/user';
import { IUserRequest } from '../interfaces/user';

@injectable()
export class AuthMiddleware extends BaseMiddleware {

    private jwt: JsonWebTokenService;
    private userRepo: UserRepository;
    private logger: Logger;

    public constructor(
        @inject(TYPES.JsonWebTokenService) jwt: JsonWebTokenService,
        @inject(TYPES.UserRepository) userRepo: UserRepository,
        @inject(TYPES.WinstonLogger) logger: Logger,
    ) {
        super();
        this.jwt = jwt;
        this.userRepo = userRepo;
        this.logger = logger;
    }

    public async handler(req: IUserRequest, res: Response, next: NextFunction) {
        try {
            const token = <string>req.headers['authorization'];
            if (!token) {
                throw new Error('ERR_INVALID_JWT');
            }
            const parts = token.split(' ');
            if (parts.length !== 2) {
                throw new Error('ERR_INVALID_JWT');
            }
            // inspect the JWT token received from the client
            const scheme = parts[0];
            // inspect the scheme
            if (!/^Bearer$/i.test(scheme)) {
                throw new Error('ERR_INVALID_JWT');
            }
            try {
                const jwtData = await this.jwt.verify(parts[1]);
                const user = await this.userRepo.findUserById(jwtData.data);
                if (user === null) {
                    throw new Error('ERR_AUTH_FAILED');
                } else {
                    req.user = user;
                }
            } catch (err) {
                this.logger.error(err);
                throw new Error('ERR_AUTH_FAILED');
            }
            next();
        } catch (err) {
            next(err);
        }
    }

}