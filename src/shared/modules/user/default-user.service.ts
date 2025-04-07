import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { UserService } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { HttpError } from '../../libs/rest/index.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result as DocumentType<UserEntity>;
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity>> {
    const user = await this.userModel.findById(userId).exec();
    return user as DocumentType<UserEntity>;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity>> {
    const user = await this.userModel.findOne({ email });
    return user as DocumentType<UserEntity>;
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    try {
      const existedUser = await this.findByEmail(dto.email);

      if (existedUser) {
        return existedUser;
      }

      return this.create(dto, salt);
    } catch (error) {
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
  }
}
