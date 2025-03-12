import { Container } from 'inversify';

import { CLIApplication } from './cli-app.js';
import { Component } from '../shared/types/index.js';
import { Logger, PinoLogger } from '../shared/libs/logger/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { ImportCommand } from './commands/import.command.js';

export function creatCLIApplicationContainer() {
  const CLIApplicationContainer = new Container();

  CLIApplicationContainer.bind<CLIApplication>(Component.CLIApplication).to(CLIApplication).inSingletonScope();
  CLIApplicationContainer.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  CLIApplicationContainer.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  CLIApplicationContainer.bind<ImportCommand>(Component.ImportCommand).to(ImportCommand).inSingletonScope();

  return CLIApplicationContainer;
}
