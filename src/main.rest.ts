import 'reflect-metadata';
import { Container } from 'inversify';

import { Application, createRestApplicationContainer } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { createUserContainer } from './shared/modules/user/index.js';


function bootstrap() {
  const appContainer = Container.merge(createRestApplicationContainer(), createUserContainer());
  const application = appContainer.get<Application>(Component.Application);

  application.init();
}


bootstrap();
