import { City, Comfort, HouseType} from '../../../types/index.js';
import { IsArray, IsDateString, IsEnum, IsInt, IsString, MaxLength, MinLength, IsBoolean, ArrayUnique, IsObject, ValidateNested, IsLongitude, IsLatitude, IsUrl } from 'class-validator';
import { CreateOfferValidationMessage } from './create-offer.messages.js';
import { Type } from 'class-transformer';

export class CoordinatesDto {
  @IsLatitude({ message: CreateOfferValidationMessage.coordinates.invalidLatitude })
  public latitude!: number;

  @IsLongitude({ message: CreateOfferValidationMessage.coordinates.invalidLongitude })
  public longitude!: number;
}

export class CreateOfferDto {
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  public title: string;

  @MinLength(20, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateOfferValidationMessage.description.maxLength })
  public description: string;

  @IsDateString({}, { message: CreateOfferValidationMessage.date.invalidFormat })
  public date: Date;

  @IsEnum(City, { message: CreateOfferValidationMessage.city.invalidId })
  public city!: City;

  @MaxLength(256, { message: CreateOfferValidationMessage.previewImage.maxLength })
  @IsUrl({}, { message: CreateOfferValidationMessage.previewImage.invalidUrl })
  public previewImage: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @MinLength(6, { message: CreateOfferValidationMessage.images.minLength })
  @MaxLength(6, { message: CreateOfferValidationMessage.images.maxLength })
  @IsUrl({}, { each: true, message: CreateOfferValidationMessage.images.invalidUrl })
  public images: string[];

  @IsBoolean()
  public isPremium: boolean;

  @IsEnum(HouseType, { message: CreateOfferValidationMessage.type.invalid })
  public type: HouseType;

  @IsInt()
  public bedrooms: number;

  @IsInt()
  public maxAdults: number;

  @IsInt()
  public price: number;

  @IsArray()
  @ArrayUnique()
  @IsEnum(Comfort, { each: true, message: CreateOfferValidationMessage.comforts.invalidId })
  public comforts!: Comfort[];

  public userId: string;

  @IsObject()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  public coordinates!: CoordinatesDto;
}

