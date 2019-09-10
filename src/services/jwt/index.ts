import { inject, injectable } from 'inversify';
import * as jwt from 'jsonwebtoken';
import { YamlConfig } from '../../services/yaml';
import { TYPES } from '../../constants';

interface JwtDataFormat {
    data: string,
    iat: number
}

@injectable()
export class JsonWebTokenService {

    private config: YamlConfig;

    public constructor(
        @inject(TYPES.Config) config: YamlConfig
    ) {
        this.config = config;
    }

    public sign(payload: string): string {
        const jwtConfig = this.config.jwt;
        return jwt.sign({ data: payload }, jwtConfig.secret, {
            algorithm: jwtConfig.algorithem,
            expiresIn: jwtConfig.expireTime
        });
    }

    public verify(token: string): JwtDataFormat {
        const jwtConfig = this.config.jwt;
        return <JwtDataFormat>jwt.verify(token, jwtConfig.secret);
    }

}