import { inject, injectable } from 'inversify';
import * as bcrypt from 'bcrypt';
import passport from 'passport';
import passportLocal from 'passport-local';
import passportFacebookToken from 'passport-facebook-token';
import { Logger } from 'winston';
import { IUser } from '../../../express/models/user';
import { UserRepository } from '../../repository/user';
import { sleep } from '../../../utils';
import { TYPES } from '../../../constants';

export interface Task {
    func: () => Promise<void>;
}

@injectable()
export class PassportService {

    private queue: Task[];
    private userRepo: UserRepository;
    private logger: Logger;

    public constructor(
        @inject(TYPES.UserRepository) userRepo: UserRepository,
        @inject(TYPES.WinstonLogger) logger: Logger,
    ) {
        this.queue = [];
        this.userRepo = userRepo;
        this.logger = logger;
        this.createUser();
    }

    private addCreateUserFunc(func: Function): void {
        const task = <Task>{
            func,
        };
        this.queue.push(task);
    }

    public async createUser(): Promise<void> {
        while (true) {
            try {
                const task = this.queue.shift();
                if (!task) {
                    await sleep(100);
                    continue;
                } else {
                    await task.func();
                }
            } catch (err) {
                this.logger.error(err);
            }
        }
    }

    public init() {
        // Take user object, store information in a session
        passport.serializeUser((user: IUser, done: any) => {
            // @ts-ignore
            done(undefined, user._id);
        });

        // Take information from the session, check if the session is still valid
        passport.deserializeUser(async (id: string, done: any) => {
            try {
                const user = await this.userRepo.findUserById(id);
                return done(undefined, user);
            } catch (err) {
                return done(err, undefined);
            }
        });

        // Login a user locally
        const LocalStrategy = passportLocal.Strategy;
        passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
            (async (email, password, done) => {
                const user = await this.userRepo.findUserByEmail(email);
                if (!user) {
                    return done(null, false, { message: 'Incorrect email.' });
                }

                const res = await bcrypt.compare(password, user.password ? user.password : '');
                if (!res) {
                    if (user.facebookId) {
                        return done(null, false, {
                            message: 'Looks like you used Facebook or Google to sign in. If you want to sign in normally, register with us and provide a password, and we will link it to your account'
                        });
                    } else {
                        return done(null, false, {
                            message: 'Invalid Password'
                        });
                    }
                }
                const returnUser = {
                    email: user.email,
                    fullName: user.fullName,
                    // @ts-ignore
                    _id: user._id
                };
                return done(null, returnUser, {
                    message: 'Logged In Successfully'
                });
            })
        ));

        passport.use('register', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        }, (async (req, email, password, done) => {
            try {
                const user = await this.userRepo.findUserByEmail(email);
                if (user) {
                    if (user.facebookId) {
                        const updatedUser = (await this.userRepo.updateCredentialsByFacebookId(
                            user.facebookId,
                            req.body.username,
                            await bcrypt.hash(password, 10)
                        ))!;

                        const result = {
                            email: updatedUser.email,
                            fullName: updatedUser.fullName,
                            _id: updatedUser.username
                        };
                        return done(null, result, { message: 'You were already registered with Facebook but we added the password to your account and assigned a username.  You can login either way now' });

                    } else {
                        const result = {
                            email: user.email,
                            fullName: user.fullName,
                            // @ts-ignore
                            _id: user._id
                        };
                        return done(null, result, { message: 'User already exists' });
                    }
                } else {
                    const task = async () => {
                        const userObj = <IUser>{
                            email: req.body.email,
                            password: await bcrypt.hash(password, 10),
                            fullName: req.body.fullName,
                            username: req.body.username,
                        };
                        try {
                            const newUser = await this.userRepo.createNewUser(userObj);
                            const result = {
                                email: newUser.email,
                                fullName: newUser.fullName,
                                _id: newUser.username
                            };
                            return done(null, result, { message: 'User created Successfully' });
                        } catch (err) {
                            this.logger.error(err);
                            return done(err);
                        }
                    }
                    this.addCreateUserFunc(task);
                }
            }
            catch (err) {
                return done(err);
            }
        })));

        // Register/Login a user via Facebook
        const FacebookTokenStrategy = passportFacebookToken;
        passport.use(new FacebookTokenStrategy({
            clientID: process.env.FACEBOOK_APP_ID!,
            clientSecret: process.env.FACEBOOK_APP_SECRET!,
            // Get additional fields.  All fields available at https://developers.facebook.com/docs/graph-api/reference/v2.7/user
            profileFields: ['email', 'picture', 'name']
        },
            (async (accessToken, refreshToken, profile, done) => {
                const user = await this.userRepo.findUserByFacebookId(profile.id);
                // No user found, then create an account
                if (!user) {
                    const fullName = profile.name.givenName + ' ' + profile.name.familyName;
                    const userObj = <IUser>{
                        facebookId: profile.id,
                        email: profile.emails[0].value,
                        fullName
                    };
                    const newUser = await this.userRepo.createNewUser(userObj);
                    // Create object to send back
                    const returnUser = {
                        email: newUser.email,
                        fullName: newUser.fullName,
                        _id: newUser.username
                    };
                    return done(null, returnUser, { message: 'Facebook user created' });
                } else {
                    // Found an account, link account to Facebook ID
                    // @ts-ignore
                    const updatedUser = (await this.userRepo.updateEmailAndFacebookIdById(user._id, profile.id, user.email))!;
                    // Create object to send back
                    const returnUser = {
                        email: updatedUser.email,
                        fullName: updatedUser.fullName,
                        _id: updatedUser.username
                    };
                    return done(null, returnUser, { message: 'User already registered, linked Facebook account' });
                }
            })
        ));
    }
}
