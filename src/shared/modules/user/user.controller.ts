import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { UserService } from './user-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { RestSchema } from '../../libs/config/index.js';
import { Config } from '../../libs/config/index.js';


@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController…');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.register });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
  }

  public async login(req: Request, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(req.body.email);
    const responseUser = fillDTO(UserRdo, user);
    this.ok(res, responseUser);
  }

  public async register({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>, res: Response): Promise<void> {
    const existedUser = await this.userService.findByEmail(body.email);

    if (existedUser) {
      const existUserError = new Error(`User with email «${body.email}» exists.`);
      this.send(res,
        StatusCodes.UNPROCESSABLE_ENTITY,
        { error: existUserError.message }
      );

      return this.logger.error(existUserError.message, existUserError);
    }

    const newUser = await this.userService.create(body, this.config.get('SALT'));

    this.created(res, fillDTO(UserRdo, newUser));
  }
}
