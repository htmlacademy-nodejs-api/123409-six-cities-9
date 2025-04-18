import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { User, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';
import { OfferEntity } from '../offer/offer.entity.js';
import { Types } from 'mongoose';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, minlength: [2, 'Min length for firstname is 2'] })
  public name: string;

  @prop({ required: true, unique: true, match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is invalid'] })
  public email: string;

  @prop()
  public avatarPath: string;

  @prop({ required: true })
  private password: string;

  @prop({ enum: UserType, default: UserType.Regular })
  public type: UserType;

  @prop({ ref: OfferEntity, default: [] })
  public favorites: Types.ObjectId[];

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatarPath = userData.avatarPath;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    return this.password === createSHA256(password, salt);
  }
}

export const UserModel = getModelForClass(UserEntity);
