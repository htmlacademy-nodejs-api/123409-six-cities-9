import 'reflect-metadata';
import { Container } from 'inversify';

import { Application, createRestApplicationContainer } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/index.js';
import { createCommentContainer } from './shared/modules/comment/index.js';
import { createAuthContainer } from './shared/modules/auth/index.js';
import { createUploadContainer } from './shared/modules/upload/index.js';

function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
    createAuthContainer(),
    createUploadContainer()
  );
  const application = appContainer.get<Application>(Component.Application);

  application.init();
}

bootstrap();
