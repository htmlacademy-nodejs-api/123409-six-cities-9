import { Application } from './rest/application.js';
import { PinoLogger } from './shared/libs/logger/index.js';
import { RestConfig } from './shared/libs/config/rest.config.js';

function bootstrap() {
  const logger = new PinoLogger();
  const config = new RestConfig(logger);

  const application = new Application(logger, config);

  logger.info(`Server is running on port ${config.get('PORT')}`);
  application.init();
}


bootstrap();
