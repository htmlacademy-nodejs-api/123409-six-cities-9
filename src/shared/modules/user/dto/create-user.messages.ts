export const CreateUserValidationMessage = {
  name: {
    minLength: 'Minimum name length must be 1',
    maxLength: 'Maximum name length must be 15',
  },
  email: {
    invalid: 'Email is invalid',
  },
  avatarPath: {
    invalid: 'Avatar path is invalid',
  },
  password: {
    minLength: 'Minimum password length must be 6',
    maxLength: 'Maximum password length must be 12',
  },
  type: {
    invalid: 'Type is invalid',
  },
};
