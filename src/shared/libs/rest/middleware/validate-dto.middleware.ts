import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';

interface ValidationErrorResponse {
  property: string;
  messages?: string[];
  errors?: ValidationErrorResponse[];
}

interface ErrorResponse {
  type: string;
  status: number;
  errors: ValidationErrorResponse[];
}

export class ValidateDtoMiddleware implements Middleware {
  constructor(private dto: ClassConstructor<object>) {}

  private formatError(error: ValidationError): ValidationErrorResponse {
    if (error.children && error.children.length > 0) {
      return {
        property: error.property,
        errors: error.children.map((child) => this.formatError(child))
      };
    }

    return {
      property: error.property,
      messages: error.constraints ? Object.values(error.constraints) : []
    };
  }

  public async execute({ body }: Request, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const errorResponse: ErrorResponse = {
        type: 'VALIDATION_ERROR',
        status: StatusCodes.BAD_REQUEST,
        errors: errors.map((error) => this.formatError(error))
      };

      res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
      return;
    }

    next();
  }
}
