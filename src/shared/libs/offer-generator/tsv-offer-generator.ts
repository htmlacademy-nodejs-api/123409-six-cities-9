import { OfferGenerator } from './offer-generator.interface.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';
import { MockServerData } from '../../types/mock-server.type.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.api.titles);
    const description = getRandomItem(this.mockData.api.descriptions);
    const date = getRandomItem(this.mockData.api.dates);
    const city = getRandomItem(this.mockData.api.cities);
    const previewImage = getRandomItem(this.mockData.api.previewImages);
    const images = getRandomItem(this.mockData.api.images).join(';');
    const isPremium = generateRandomValue(0, 1) === 1;
    const isFavorite = generateRandomValue(0, 1) === 1;
    const rating = generateRandomValue(1, 5);
    const type = getRandomItem(this.mockData.api.types);
    const bedrooms = generateRandomValue(1, 5);
    const maxAdults = generateRandomValue(1, 5);
    const price = generateRandomValue(100, 100000);
    const comforts = getRandomItems(this.mockData.api.comforts).join(';');
    const host = getRandomItem(this.mockData.api.users);
    const commentsCount = generateRandomValue(0, 100);
    const coordinates = getRandomItem(this.mockData.api.coordinates);

    return [
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
    ].join('\t');

  }
}
