import { City, Comfort, HouseType} from '../../../types/index.js';

export class CreateOfferDto {
  public title: string;
  public description: string;
  public date: Date;
  public city: City;
  public previewImage: string;
  public images: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public type: HouseType;
  public bedrooms: number;
  public maxAdults: number;
  public price: number;
  public comforts: Comfort[];
  public host: string;
  public commentsCount: number;
}
