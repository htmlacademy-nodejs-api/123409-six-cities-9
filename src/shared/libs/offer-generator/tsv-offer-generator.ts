import { OfferGenerator } from './offer-generator.interface.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';
import { MockServerData } from '../../types/mock-server.type.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const date = getRandomItem(this.mockData.dates);
    const city = getRandomItem(this.mockData.cities);
    const previewImage = getRandomItem(this.mockData.previewImages);
    const images = getRandomItem(this.mockData.images).join(';');
    const isPremium = generateRandomValue(0, 1) === 1;
    const isFavorite = generateRandomValue(0, 1) === 1;
    const rating = generateRandomValue(1, 5);
    const type = getRandomItem(this.mockData.types);
    const bedrooms = generateRandomValue(1, 5);
    const maxAdults = generateRandomValue(1, 5);
    const price = generateRandomValue(100, 100000);
    const comforts = getRandomItems(this.mockData.comforts).join(';');
    const user = Object.values(getRandomItem(this.mockData.users)).join(';');
    const commentsCount = generateRandomValue(0, 100);
    const coordinates = getRandomItem(this.mockData.coordinates).join(';');

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
      user,
      commentsCount,
      coordinates,
    ].join('\t');

  }
}
