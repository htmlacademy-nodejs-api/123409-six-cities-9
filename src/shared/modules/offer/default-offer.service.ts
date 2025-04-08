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
import { UserService } from '../user/user-service.interface.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserService) private readonly userService: UserService
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

  public async findById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity>> {
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
            userId: { $toString: '$userId' },
            coordinates: {
              latitude: { $toDouble: '$coordinates.latitude' },
              longitude: { $toDouble: '$coordinates.longitude' }
            },
            commentsCount: { $size: '$comments' },
            rating: { $avg: '$comments.rating' },
            isFavorite: userId ? {
              $in: ['$_id', await this.getUserFavorites(userId)]
            } : false
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

  public async find(count?: number, sortType?: SortType, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    try {
      const limit = count ?? DEFAULT_OFFER_COUNT;
      const sort = sortType ?? SortType.Down;
      const userFavorites = userId ? await this.getUserFavorites(userId) : [];

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
            userId: { $toString: '$userId' },
            coordinates: {
              latitude: { $toDouble: '$coordinates.latitude' },
              longitude: { $toDouble: '$coordinates.longitude' }
            },
            commentsCount: { $size: '$comments' },
            rating: { $avg: '$comments.rating' },
            isFavorite: userId ? {
              $in: ['$_id', userFavorites]
            } : false
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
    userId?: string
  ): Promise<types.DocumentType<OfferEntity>[]> {
    const userFavorites = userId ? await this.getUserFavorites(userId) : [];

    return this.offerModel.aggregate([
      { $match: { city, isPremium: true } },
      {
        $addFields: {
          isFavorite: userId ? {
            $in: ['$_id', userFavorites]
          } : false
        }
      },
      { $sort: { createdAt: SortType.Down } },
      { $limit: DEFAULT_OFFER_COUNT }
    ]);
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }

  public async toggleFavorite(offerId: string, userId: string): Promise<boolean> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');
    }

    const offerObjectId = new Types.ObjectId(offerId);
    const favoriteIndex = user.favorites.indexOf(offerObjectId);

    if (favoriteIndex === -1) {
      user.favorites.push(offerObjectId);
    } else {
      user.favorites.splice(favoriteIndex, 1);
    }

    await user.save();
    return favoriteIndex === -1;
  }

  private async getUserFavorites(userId: string): Promise<Types.ObjectId[]> {
    const user = await this.userService.findById(userId);
    return user?.favorites || [];
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');
      }

      return this.offerModel.aggregate([
        { $match: { _id: { $in: user.favorites } } },
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
            isFavorite: true
          },
        },
        { $sort: { createdAt: SortType.Down } }
      ]);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      this.logger.error('Error finding favorite offers:', error as Error);
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Error finding favorite offers'
      );
    }
  }
}
