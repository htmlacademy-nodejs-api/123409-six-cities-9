import 'reflect-metadata';
import { Container } from 'inversify';

import { Application } from './rest/application.js';
import { Logger, PinoLogger } from './shared/libs/logger/index.js';
import { Config, RestSchema,RestConfig } from './shared/libs/config/index.js';
import { Component } from './shared/types/index.js';

function bootstrap() {
  const container = new Container();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  container.bind<Application>(Component.Application).to(Application).inSingletonScope();


  const application = container.get<Application>(Component.Application);
  application.init();
}


bootstrap();
