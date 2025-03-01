import { Logger } from '../shared/libs/logger/index.js';
import { Config } from '../shared/libs/config/config.interface.js';

export class Application {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config
  ) {}

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Server is running on port ${this.config.get('PORT')}`);
  }
}
