import { IsEnum, IsUrl, IsEmail, MaxLength, MinLength } from 'class-validator';
import { CreateUserValidationMessage } from './create-user.messages.js';
import { UserType } from '../../../types/index.js';

export class CreateUserDto {
  @MinLength(1, { message: CreateUserValidationMessage.name.minLength })
  @MaxLength(15, { message: CreateUserValidationMessage.name.maxLength })
  public name: string;

  @IsEmail({}, { message: CreateUserValidationMessage.email.invalid })
  public email: string;

  @MinLength(6, { message: CreateUserValidationMessage.password.minLength })
  @MaxLength(12, { message: CreateUserValidationMessage.password.maxLength })
  public password: string;

  @IsEnum(UserType, { message: CreateUserValidationMessage.type.invalid })
  public type: UserType;
}
