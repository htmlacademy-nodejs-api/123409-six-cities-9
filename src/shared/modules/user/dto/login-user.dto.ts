import { MaxLength, MinLength, IsEmail } from 'class-validator';
import { CreateUserValidationMessage } from './create-user.messages.js';

export class LoginUserDto {
  @IsEmail({}, { message: CreateUserValidationMessage.email.invalid })
  public email: string;

  @MinLength(6, { message: CreateUserValidationMessage.password.minLength })
  @MaxLength(12, { message: CreateUserValidationMessage.password.maxLength })
  public password: string;
}
