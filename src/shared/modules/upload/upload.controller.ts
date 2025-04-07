import { inject } from 'inversify';
import { Response, Request } from 'express';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import {
  BaseController,
  HttpMethod,
  UploadFileMiddleware,
} from '../../libs/rest/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
export class UploadController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for UploadController…');

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create, middlewares: [new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'image')] });
  }

  public async create(req: Request, res: Response): Promise<void> {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}
