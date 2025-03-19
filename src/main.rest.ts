import 'reflect-metadata';
import { Container } from 'inversify';

import { Application, createRestApplicationContainer } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/index.js';
import { createCommentContainer } from './shared/modules/comment/index.js';

function bootstrap() {
  const appContainer = Container.merge(createRestApplicationContainer(), createUserContainer(), createOfferContainer(), createCommentContainer());
  const application = appContainer.get<Application>(Component.Application);

  application.init();
}


bootstrap();
