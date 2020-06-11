import * as fs from 'fs';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import mustache from 'mustache';
import { Logger } from 'winston';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../constants';
import { YamlConfig, MailerConfig } from '../../services/yaml';

@injectable()
export class MailerService {

    private config: MailerConfig;
    private fromAddress: string;
    private transport: Mail;
    private logger: Logger;

    public constructor(
        @inject(TYPES.Config) config: YamlConfig,
        @inject(TYPES.WinstonLogger) logger: Logger,
    ) {
        this.config = config.mailer;
        this.fromAddress = config.mailer.fromAddress;
        this.transport = nodemailer.createTransport({
            host: config.mailer.host,
            port: config.mailer.port,
            secure: false, // upgrade later with STARTTLS
            // auth: {
            //     user: config.mailer.username,
            //     pass: config.mailer.password
            // }
        });
        this.logger = logger;
    }

    private async readEmailTemplate(templateName: string): Promise<string> {
        return await new Promise<string>((resolve, reject) => {
            fs.readFile(`${__dirname}/template/${templateName}`, 'utf8', (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }

    private async send(to: string, subject: string, html: string): Promise<nodemailer.SentMessageInfo> {
        try {
            const mailOptions = <Mail.Options>{
                from: this.fromAddress,
                to,
                subject,
                html
            }
            if (this.config.sendEmail) {
                return await this.transport.sendMail(mailOptions);
            } else {
                return "not sending email as configured"; // this works because nodemailer.SentMessageInfo is actually "any"
            }
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }
}
