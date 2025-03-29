import { inject } from 'inversify';
import { Response, Request } from 'express';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { CommentRdo, CommentService } from '../comment/index.js';
import { StatusCodes } from 'http-status-codes';

export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:id', method: HttpMethod.Get, handler: this.show });
    this.addRoute({ path: '/:id', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:id', method: HttpMethod.Delete, handler: this.delete });
    this.addRoute({ path: '/:id/comments', method: HttpMethod.Post, handler: this.getComments });
  }

  public async create(
    { body }: Request,
    res: Response,
  ): Promise<void> {
    const newOffer = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, newOffer));
  }

  public async index(
    _req: Request,
    res: Response,
  ): Promise<void> {
    const offers = await this.offerService.find();
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async show(
    { params }: Request,
    res: Response,
  ): Promise<void> {
    const offer = await this.offerService.findById(params.id);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update(
    { params, body }: Request,
    res: Response,
  ): Promise<void> {
    const offer = await this.offerService.updateById(params.id, body);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async delete(
    { params }: Request,
    res: Response,
  ): Promise<void> {
    await this.offerService.deleteById(params.id);
    await this.commentService.deleteByOfferId(params.id);
    this.ok(res, { message: 'Offer deleted successfully' });
  }

  public async getComments({ params }: Request, res: Response): Promise<void> {
    if (!await this.offerService.exists(params.id)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.id} not found.`,
        'OfferController'
      );
    }

    const comments = await this.commentService.findByOfferId(params.id);
    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
