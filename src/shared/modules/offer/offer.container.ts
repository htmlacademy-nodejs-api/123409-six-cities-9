import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { OfferService } from './offer-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultOfferService } from './default-offer.service.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { Controller } from '../../libs/rest/index.js';
import { OfferController } from './offer.controller.js';
import { UserService } from '../user/user-service.interface.js';
import { DefaultUserService } from '../user/default-user.service.js';

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<OfferService>(Component.OfferService).to(DefaultOfferService);
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  offerContainer.bind<Controller>(Component.OfferController).to(OfferController).inSingletonScope();
  offerContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();

  return offerContainer;
}
