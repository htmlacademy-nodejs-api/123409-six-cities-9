import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';

import {
  City,
  Comfort,
  Coordinates,
  HouseType,
} from '../../types/index.js';
import { UserEntity } from '../user/index.js';
import { CoordinatesDto } from './dto/create-offer.dto.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  },
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    minlength: [10, 'Min length for title is 10'],
    maxlength: [100, 'Max length for title is 100'],
  })
  public title: string;

  @prop({
    required: true,
    minlength: [20, 'Min length for description is 20'],
    maxlength: [1024, 'Max length for description is 1024'],
  })
  public description: string;

  @prop({ required: true })
  public date: Date;

  @prop({ required: true, enum: City })
  public city: City;

  @prop({ required: true })
  public previewImage!: string;

  @prop({ required: true, type: [String] })
  public images!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ required: true })
  public isFavorite!: boolean;

  @prop({ required: true, enum: HouseType })
  public type!: HouseType;

  @prop({
    required: true,
    min: [1, 'Min bedrooms is 1'],
    max: [8, 'Max bedrooms is 8'],
  })
  public bedrooms!: number;

  @prop({
    required: true,
    min: [1, 'Min maxAdults is 1'],
    max: [10, 'Max maxAdults is 10'],
  })
  public maxAdults!: number;

  @prop({
    required: true,
    min: [100, 'Min price is 100'],
    max: [100000, 'Max price is 100000'],
  })
  public price!: number;

  @prop({ required: true, type: [String], enum: Comfort })
  public comforts!: Comfort[];

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId!: Ref<UserEntity>;

  @prop({ required: true, type: CoordinatesDto })
  public coordinates!: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
