import { inject } from 'inversify';
import { Response } from 'express';
import { controller, httpGet, httpPost, httpPut, httpDelete, response, requestBody, requestParam } from 'inversify-express-utils';
import { ErrorDescription } from '../../models/error';
import { ErrorDescriptionRepository } from '../../../repository/error';
import { TYPES } from '../../../constants';


@controller('/api/v1/errors')
export class ErrorDescriptionController {

    private errorRepo: ErrorDescriptionRepository;

    public constructor(
        @inject(TYPES.ErrorDescriptionRepository) errorRepo: ErrorDescriptionRepository
    ) {
        this.errorRepo = errorRepo;
    }

    @httpGet('/')
    public async getAllErrors(
        @response() res: Response): Promise<Response>
    {
        const errors = await this.errorRepo.findAllErrors();
        return res.send(errors);
    }

    @httpPost('/')
    public async createError(
        @response() res: Response,
        @requestBody() errorDto: ErrorDescription): Promise<Response>
    {
        const error = await this.errorRepo.createError(errorDto);
        return res.send(error);
    }

    @httpPut('/:id')
    public async updateError(
        @requestParam('id') id: string,
        @requestBody() errorDto: ErrorDescription,
        @response() res: Response): Promise<Response>
    {
        const error = await this.errorRepo.updateErrorById(id, errorDto);
        return res.send(error);
    }

    @httpDelete('/:id')
    public async deleteError(
        @requestParam('id') id: string,
        @response() res: Response): Promise<Response>
    {
        const error =  await this.errorRepo.removeErrorById(id);
        return res.send(error);
    }

}