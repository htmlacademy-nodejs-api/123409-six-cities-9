import { IsOptional, MinLength, MaxLength, IsString } from 'class-validator';
import { CreateUserValidationMessage } from './create-user.messages.js';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: CreateUserValidationMessage.avatarPath.invalid })
  public avatarPath?: string;

  @IsOptional()
  @MinLength(1, { message: CreateUserValidationMessage.name.minLength })
  @MaxLength(15, { message: CreateUserValidationMessage.name.maxLength })
  public name?: string;
}
