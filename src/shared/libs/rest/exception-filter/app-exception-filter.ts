import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

import { ExceptionFilter } from './exception-filter.interface.js';
import { Logger } from '../../logger/index.js';
import { Component } from '../../../types/index.js';
import { createErrorObject } from '../../../helpers/index.js';
import { HttpError } from '../index.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Register AppExceptionFilter');
  }

  private handleHttpError(error: HttpError, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(`[${error.detail}]: ${error.httpStatusCode} — ${error.message}`, error);
    res
      .status(error.httpStatusCode)
      .json(createErrorObject(error));
  }

  private handleOtherError(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(error.message, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject({message: error.message}));
  }

  public catch(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    if (error instanceof HttpError) {
      this.handleHttpError(error, _req, res, _next);
      return;
    }

    this.handleOtherError(error, _req, res, _next);
  }

}
