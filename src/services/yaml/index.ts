import { injectable } from 'inversify';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import * as yaml from 'js-yaml';

@injectable()
export class Config {

  private config: YamlConfig;
  private filePath: string;

  public constructor(filePath: string) {
    this.filePath = filePath;
    this.config = <YamlConfig>{};
  }

  private async readConfig(): Promise<void> {
    // attempt to read the yml file and potentially throw IO Exception
    const content = await new Promise<string>((resolve, reject) => {
      fs.readFile(path.resolve(process.cwd(), this.filePath), 'utf8', (err, content) => {
        if (err) {
          return reject(err);
        }
        return resolve(content);
      });
    });
    this.config = yaml.safeLoad(content);
  }

  public async getConfig(): Promise<YamlConfig> {
    if (_.isEmpty(this.config)) {
      await this.readConfig();
    }
    return this.config;
  }

}

export interface YamlConfig {
  jwt: JwtConfig,
  mailer: MailerConfig,
  mongodb: MongoConfig,
}

export interface JwtConfig {
  secret: string,
  expireTime: number,
  algorithem: 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512' | 'ES256' | 'ES384' | 'ES512' | 'PS256' | 'PS384' | 'PS512' | 'none' | undefined,
}

export interface MailerConfig {
  host: string,
  port: number,
  username: string,
  password: string,
  fromAddress: string,
  sendEmail: boolean,
}

export interface MongoConfig {
  host: string,
  port: number,
  username?: string,
  password?: string,
  dbName: string,
  replicaSetName?: string
}