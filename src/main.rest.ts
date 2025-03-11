import 'reflect-metadata';
import { Container } from 'inversify';

import { Application } from './rest/application.js';
import { Component } from './shared/types/index.js';
import { createRestApplicationContainer } from './rest/rest.container.js';

function bootstrap() {
  const appContainer = Container.merge(createRestApplicationContainer());
  const application = appContainer.get<Application>(Component.Application);

  application.init();
}


bootstrap();
