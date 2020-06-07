import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { set, connect, connection, Connection } from 'mongoose';
import { TYPES } from '../../constants';
import { YamlConfig } from '../yaml/';

@injectable()
export class MongoDbService {

    private config: YamlConfig;
    private client: Connection;
    private logger: Logger;

    public constructor(
        @inject(TYPES.Config) config: YamlConfig,
        @inject(TYPES.WinstonLogger) logger: Logger,
    ) {
        this.config = config;
        this.logger = logger;
        this.client = connection;
        // register the listener
        this.client.on('connected', () => {
            this.logger.info(`Successfully connected to MongoDB at host: ${config.mongodb.host}, port: ${config.mongodb.port}, database: ${config.mongodb.dbName}`);
        });
        this.client.on('disconnected', () => {
            this.logger.warn('MongoDB disconnected');
        });
        this.client.on('error', (err: Error) => {
            this.logger.error(`MongoDB connection is dropped due to the following error: ${err}`)
        });
    }

    public getConnectionString(): string {
        if (process.env.MONGODB_ENDPOINT) {
            return process.env.MONGODB_ENDPOINT
        } else {
            const mongoConfig = this.config.mongodb;
            if (mongoConfig.username && mongoConfig.password && mongoConfig.replicaSetName) {
                return `mongodb://${mongoConfig.username}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.dbName}?replicaSet=${mongoConfig.replicaSetName}&authSource=admin&authMechanism=SCRAM-SHA-256`;
            } else if (!mongoConfig.username && !mongoConfig.password && mongoConfig.replicaSetName) {
                return `mongodb://${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.dbName}?replicaSet=${mongoConfig.replicaSetName}`;
            } else if (mongoConfig.username && mongoConfig.password && !mongoConfig.replicaSetName) {
                return `mongodb://${mongoConfig.username}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.dbName}?authSource=admin&authMechanism=SCRAM-SHA-256`;
            } else if (!mongoConfig.username && !mongoConfig.password && !mongoConfig.replicaSetName) {
                return `mongodb://${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.dbName}`;
            } else {
                throw new Error('ERR_CONFIG_ERROR');
            }
        }
    }

    public async connectDb(): Promise<void> {
        set('useCreateIndex', true);
        await connect(this.getConnectionString(), { useNewUrlParser: true });
        this.logger.info("MongoDB connected...")
    }

    public getClient(): Connection {
        return this.client;
    }

}