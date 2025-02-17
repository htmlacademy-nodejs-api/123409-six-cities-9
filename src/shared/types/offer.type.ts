import { City, Coordinates } from './city.enum.js';
import { Comfort } from './comfort.enum.js';
import { HouseType } from './house-type.enum.js';


export type Offer = {
    title: string;
    description: string;
    date: Date;
    city: City;
    previewImage: string;
    images: string[];
    isPremium: boolean;
    isFavorite: boolean;
    rating: number;
    type: HouseType;
    bedrooms: number;
    maxAdults: number;
    price: number;
    comforts: Comfort[];
    host: string;
    commentsCount: number;
    coordinates: Coordinates;
}
