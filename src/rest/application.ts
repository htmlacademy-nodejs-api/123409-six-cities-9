import { Logger } from '../shared/libs/logger/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';

export class Application {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config<RestSchema>
  ) {}

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Server is running on port ${this.config.get('PORT')}`);
  }
}
