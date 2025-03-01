import { Application } from './rest/application.js';
import { PinoLogger } from './shared/libs/logger/index.js';


function bootstrap() {
  const logger = new PinoLogger();

  const application = new Application(logger);
  application.init();
}


bootstrap();
