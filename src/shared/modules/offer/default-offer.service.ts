import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { OfferService } from './offer-service.interface.js';
import { City, Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { SortType } from '../../types/sort.enum.js';
import { DEFAULT_OFFER_COUNT } from './offer.constants.js';
import { HttpError } from '../../libs/rest/index.js';
import { StatusCodes } from 'http-status-codes';

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
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Error creating offer'
      );
    }
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity>> {
    try {
      const offers = await this.offerModel.aggregate([
        { $match: { _id: new Types.ObjectId(offerId) } },
        {
          $lookup: {
            from: 'comments',
            let: { offerId: '$_id' },
            pipeline: [
              { $match: {
                $expr: { $eq: ['$offerId', '$$offerId'] }
              } },
              { $project: { rating: 1 } },
            ],
            as: 'comments',
          },
        },
        {
          $addFields: {
            id: { $toString: '$_id' },
            commentsCount: { $size: '$comments' },
            rating: { $avg: '$comments.rating' },
          },
        },
      ]).exec();

      if (!offers.length) {
        throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${offerId} not found`);
      }

      return offers[0];
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      this.logger.error('Error finding offer by id:', error as Error);
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Error finding offer'
      );
    }
  }

  public async find(count?: number, sortType?: SortType): Promise<DocumentType<OfferEntity>[]> {
    try {
      const limit = count ?? DEFAULT_OFFER_COUNT;
      const sort = sortType ?? SortType.Down;

      return this.offerModel.aggregate([
        {
          $lookup: {
            from: 'comments',
            let: { offerId: '$_id' },
            pipeline: [
              { $match: {
                $expr: { $eq: ['$offerId', '$$offerId'] }
              } },
              { $project: { rating: 1 } },
            ],
            as: 'comments',
          },
        },
        {
          $addFields: {
            id: { $toString: '$_id' },
            commentsCount: { $size: '$comments' },
            rating: { $avg: '$comments.rating' },
          },
        },
        { $limit: limit },
        { $sort: { createdAt: sort } },
      ]);
    } catch (error) {
      this.logger.error('Error finding offers:', error as Error);
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Error finding offers'
      );
    }
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async updateById(offerId: string, dto: CreateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate(['userId'])
      .exec();
  }

  public async findPremiumByCity(
    city: City,
  ): Promise<types.DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city, isPremium: true })
      .sort({ createdAt: SortType.Down })
      .limit(DEFAULT_OFFER_COUNT)
      .populate(['userId']);
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }
}
