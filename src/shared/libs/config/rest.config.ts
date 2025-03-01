import { Logger } from '../logger/index.js';
import { Config } from './config.interface.js';
import { DotenvParseOutput, config } from 'dotenv';

export class RestConfig implements Config {
  private readonly config: NodeJS.ProcessEnv;

  constructor(
    private readonly logger: Logger
  ) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Failed to parse .env file');
    }

    this.config = <DotenvParseOutput>parsedOutput.parsed;
    this.logger.info('.env file found and successfully parsed!');
  }

  public get(key: string): string | undefined {
    return this.config[key];
  }
}
