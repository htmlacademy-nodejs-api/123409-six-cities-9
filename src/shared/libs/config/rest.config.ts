import { Logger } from '../logger/index.js';
import { Config } from './config.interface.js';
import { config } from 'dotenv';
import { RestSchema, restSchema } from './rest.schema.js';

export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor(private readonly logger: Logger) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Failed to parse .env file');
    }

    restSchema.load({});
    restSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = restSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
