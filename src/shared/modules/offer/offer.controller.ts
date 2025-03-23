import { inject } from 'inversify';
import { Response, Request } from 'express';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferRdo } from './rdo/offer.rdo.js';


export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:id', method: HttpMethod.Get, handler: this.show });
    this.addRoute({ path: '/:id', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:id', method: HttpMethod.Delete, handler: this.delete });
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
    this.ok(res, { message: 'Offer deleted successfully' });
  }
}
