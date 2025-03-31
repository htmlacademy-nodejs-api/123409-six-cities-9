
export const CreateCommentValidationMessage = {
  text: {
    minLength: 'Minimum text length must be 5',
    maxLength: 'Maximum text length must be 1024',
  },
  rating: {
    min: 'Minimum rating must be 1',
    max: 'Maximum rating must be 5',
  },
  offerId: {
    invalidId: 'offerId field must be a valid id',
  },
  userId: {
    invalidId: 'userId field must be a valid id',
  },
};
