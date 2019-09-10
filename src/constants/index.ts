export const TYPES = {
    AuthMiddleware: Symbol('AuthMiddleware'),
    Config: Symbol('Config'),
    DateTimeService: Symbol('DateTimeService'),
    ErrorHandlerService: Symbol('ErrorHandlerService'),
    JsonWebTokenService: Symbol('JsonWebTokenService'),
    GoogleMapService: Symbol('GoogleMapService'),
    MailerService: Symbol('MailerService'),
    MongoDbService: Symbol('MongoDbService'),
    PassportService: Symbol('PassportService'),
    // DAO injection
    UserRepository: Symbol('UserRepository'),
    ErrorDescriptionRepository: Symbol('ErrorDescriptionRepository'),
    // Logger
    WinstonLogger: Symbol('WinstonLogger'),
};
