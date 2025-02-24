import { City } from './city.enum.js';
import { Comfort } from './comfort.enum.js';
import { HouseType } from './house-type.enum.js';

export type MockServerData = {
  titles: string[];
  descriptions: string[];
  cities: City[];
  previewImages: string[];
  images: string[][];
  types: HouseType[];
  comforts: Comfort[];
  coordinates: [number, number][];
  hosts: string[];
  dates: string[];
};
