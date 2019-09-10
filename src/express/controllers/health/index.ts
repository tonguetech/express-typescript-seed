import { Response } from 'express';
import { controller, httpGet, response } from 'inversify-express-utils';


@controller('/api/v1/health')
export class HealthCheckController {

    @httpGet('/')
    public async getHealth(@response() res: Response) {
        return res.send({'foo': 'bar'});
    }

}
