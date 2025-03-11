import { Schema, Document, model } from 'mongoose';
import { User } from '../../types/index.js';

export interface UserDocument extends User, Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, 'Min length for firstname is 2']
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is invalid'],
    },
    avatarPath: String,
    password: String,
    type: {
      type: String,
      enum: ['regular', 'pro'],
      default: 'regular',
    },
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>('User', userSchema);
