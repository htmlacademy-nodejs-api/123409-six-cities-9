import { inject } from 'inversify';
import { Response, Request } from 'express';
import { City, Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import {
  BaseController,
  HttpError,
  HttpMethod,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
  DocumentExistsMiddleware,
  PrivateRouteMiddleware,
} from '../../libs/rest/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { CommentRdo, CommentService } from '../comment/index.js';
import { StatusCodes } from 'http-status-codes';
import { CreateOfferDto } from './dto/create-offer.dto.js';

export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService)
    private readonly commentService: CommentService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto), new PrivateRouteMiddleware()],
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()],
    });
    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.getPremium,
      middlewares: [new PrivateRouteMiddleware()],
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [new ValidateObjectIdMiddleware('id'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'id')],
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [new ValidateObjectIdMiddleware('id'), new ValidateDtoMiddleware(CreateOfferDto), new PrivateRouteMiddleware()],
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [new ValidateObjectIdMiddleware('id'), new PrivateRouteMiddleware()],
    });
    this.addRoute({
      path: '/:id/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [new ValidateObjectIdMiddleware('id')],
    });
    this.addRoute({
      path: '/:id/favorite',
      method: HttpMethod.Post,
      handler: this.toggleFavorite,
      middlewares: [new ValidateObjectIdMiddleware('id'), new PrivateRouteMiddleware()],
    });
  }

  public async create({ body, tokenPayload }: Request, res: Response): Promise<void> {
    const newOffer = await this.offerService.create({ ...body, userId: tokenPayload.id });
    this.created(res, fillDTO(OfferRdo, newOffer));
  }

  public async index(req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find(undefined, undefined, req.tokenPayload?.id);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async show(req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.findById(req.params.id, req.tokenPayload?.id);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update({ params, body }: Request, res: Response): Promise<void> {
    const offer = await this.offerService.updateById(params.id, body);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async delete({ params }: Request, res: Response): Promise<void> {
    await this.offerService.deleteById(params.id);
    await this.commentService.deleteByOfferId(params.id);
    this.ok(res, { message: 'Offer deleted successfully' });
  }

  public async getComments({ params }: Request, res: Response): Promise<void> {
    if (!(await this.offerService.exists(params.id))) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.id} not found.`,
        'OfferController'
      );
    }

    const comments = await this.commentService.findByOfferId(params.id);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async toggleFavorite({ params, tokenPayload }: Request, res: Response): Promise<void> {
    const isFavorite = await this.offerService.toggleFavorite(params.id, tokenPayload.id);
    this.ok(res, { isFavorite });
  }

  public async getFavorites({ tokenPayload }: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findFavorites(tokenPayload.id);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async getPremium({ params, tokenPayload }: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findPremiumByCity(params.city as City, tokenPayload.id);
    this.ok(res, fillDTO(OfferRdo, offers));
  }
}
