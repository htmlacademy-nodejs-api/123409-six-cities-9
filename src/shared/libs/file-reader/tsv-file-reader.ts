import { readFileSync } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { City, Comfort, Coordinates, HouseType, Offer } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  private validateRawData(): void {
    if (! this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      date,
      city,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      bedrooms,
      maxAdults,
      price,
      comforts,
      host,
      commentsCount,
      coordinates,
    ] = line.split('\t');

    return {
      title,
      description,
      date: new Date(date),
      city: city as City,
      previewImage,
      images: images.split(';'),
      isPremium: this.parseBoolean(isPremium),
      isFavorite: this.parseBoolean(isFavorite),
      rating: Number.parseFloat(rating),
      type: type as HouseType,
      bedrooms: this.parseToNumber(bedrooms),
      maxAdults: this.parseToNumber(maxAdults),
      price: this.parsePrice(price),
      comforts: comforts.split(';').map((comfort) => comfort as Comfort),
      host,
      commentsCount: this.parseToNumber(commentsCount),
      coordinates: coordinates.split(';').map((coordinate) => Number.parseFloat(coordinate)) as Coordinates
    };
  }

  private parseBoolean(value: string): boolean {
    return value === 'true';
  }

  private parsePrice(priceString: string): number {
    return Number.parseInt(priceString, 10);
  }

  private parseToNumber(value: string): number {
    return Number.parseInt(value, 10);
  }

  public read(): void {
    try {
      this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to read file ${this.filename}`);
    }
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
