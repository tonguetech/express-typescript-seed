import passport from 'passport';
import { inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { controller, httpGet, httpPost, httpPut, httpDelete, request, response, next, requestBody, requestParam } from 'inversify-express-utils';
import { IUser } from '../../models/user';
import { JsonWebTokenService } from '../../../services/jwt';
import { TYPES } from '../../../constants';

interface AuthResponse {
    user: IUser,
    jwt: string
}

@controller('/api/v1/auth')
export class AuthController {

    private jwt: JsonWebTokenService;

    public constructor(
        @inject(TYPES.JsonWebTokenService) jwt: JsonWebTokenService,
    ) {
        this.jwt = jwt;
    }

    @httpPost('/login')
    public async login(
        @request() req: Request,
        @response() res: Response,
        @next() next: NextFunction,
    ) {
        const user = await new Promise<IUser>((resolve, reject) => {
            // attempt to find the user with the email address
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    return reject(err);
                }
                return resolve(user);
            })(req, res, next);
        });
        if (!user) {
            throw new Error('ERR_AUTH_FAILED');
        }
        return res.send(<AuthResponse> {
            user,
            // @ts-ignore
            jwt: await this.jwt.sign(user._id)
        });
    }


    @httpGet('/facebook')
    public async facebookOAuth(
        @request() req: Request,
        @response() res: Response,
        @next() next: NextFunction,
    ) {
        const user = await new Promise<IUser>((resolve, reject) => {
            passport.authenticate('facebook-token', (err, user, info) => {
                if (err) {
                    return reject(err);
                }
                return resolve(user);
            })(req, res, next);
        });
        return res.send(<AuthResponse> {
            user,
            // @ts-ignore
            jwt: await this.jwt.sign(user._id)
        });
    }

    @httpPost('/signup')
    public async register(
        @request() req: Request,
        @response() res: Response,
        @next() next: NextFunction,
    ) {
        const user = await new Promise<IUser>((resolve, reject) => {
            passport.authenticate('register', (err, user, info) => {
                if (err) {
                    return reject(err);
                }
                return resolve(user);
            })(req, res, next);
        });
        return res.send(<AuthResponse> {
            user,
            // @ts-ignore
            jwt: await this.jwt.sign(user._id)
        });
    }

}