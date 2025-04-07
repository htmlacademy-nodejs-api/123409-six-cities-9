export const CreateOfferValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  date: {
    invalidFormat: 'postDate must be a valid ISO date',
  },
  city: {
    invalidId: 'city field must be a valid',
  },
  previewImage: {
    maxLength: 'Too short for field «previewImage»',
    invalidUrl: 'Invalid URL',
  },
  images: {
    maxLength: 'Too short for field «images»',
    minLength: 'Too short for field «images»',
    invalidUrl: 'Invalid URL',
  },
  isPremium: {
    invalid: 'isPremium must be a boolean',
  },
  type: {
    invalid: 'invalid type',
  },
  bedrooms: {
    invalid: 'bedrooms must be a number',
  },
  maxAdults: {
    invalid: 'maxAdults must be a number',
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 200000',
  },
  comforts: {
    invalidFormat: 'Field comforts must be an array',
    invalidId: 'Comforts field must be an array of valid id',
  },
  userId: {
    invalidId: 'userId field must be a valid id',
  },
  coordinates: {
    invalidLatitude: 'Latitude is invalid',
    invalidLongitude: 'Longitude is invalid',
  },
} as const;
