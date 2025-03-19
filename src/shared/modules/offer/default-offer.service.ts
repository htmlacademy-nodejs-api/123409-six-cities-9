import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { OfferService } from './offer-service.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { HttpError, HttpCode } from '../../libs/errors/http.error.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    try {
      const result = await this.offerModel.create(dto);
      this.logger.info(`New offer created: ${dto.title}`);
      return result;
    } catch (error) {
      this.logger.error('Error creating offer:', error as Error);
      throw new HttpError(
        HttpCode.INTERNAL_SERVER_ERROR,
        'Error creating offer'
      );
    }
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity>> {
    try {
      const offer = await this.offerModel.findById(offerId).exec();
      if (!offer) {
        throw new HttpError(HttpCode.NOT_FOUND, `Offer with id ${offerId} not found`);
      }
      return offer;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      this.logger.error('Error finding offer by id:', error as Error);
      throw new HttpError(
        HttpCode.INTERNAL_SERVER_ERROR,
        'Error finding offer'
      );
    }
  }

  public async find(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find();
  }
}
