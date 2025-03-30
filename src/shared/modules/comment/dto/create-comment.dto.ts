import { IsMongoId, Max, Min, MaxLength, MinLength } from 'class-validator';

import { CreateCommentValidationMessage } from './create-comment.messages.js';

export class CreateCommentDto {
  @MinLength(5, { message: CreateCommentValidationMessage.text.minLength })
  @MaxLength(1024, { message: CreateCommentValidationMessage.text.maxLength })
  public text: string;

  @Min(1, { message: CreateCommentValidationMessage.rating.min })
  @Max(5, { message: CreateCommentValidationMessage.rating.max })
  public rating: number;

  @IsMongoId({ message: CreateCommentValidationMessage.offerId.invalidId })
  public offerId: string;

  @IsMongoId({ message: CreateCommentValidationMessage.userId.invalidId })
  public userId: string;
}
