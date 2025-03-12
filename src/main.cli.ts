#!/usr/bin/env node
import 'reflect-metadata';

import { Container } from 'inversify';
import { CLIApplication, VersionCommand, HelpCommand, ImportCommand, GenerateCommand } from './cli/index.js';
import { Component } from './shared/types/component.enum.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';
import { createUserContainer } from './shared/modules/user/user.container.js';
import { creatCLIApplicationContainer } from './cli/index.js';

function bootstrap(): void {
  const cliAppContainer = Container.merge(creatCLIApplicationContainer(), createUserContainer(), createOfferContainer());
  const cliApplication = cliAppContainer.get<CLIApplication>(Component.CLIApplication);

  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    cliAppContainer.get<ImportCommand>(Component.ImportCommand),
    new GenerateCommand(),
  ]);
  cliApplication.processCommand(process.argv);
}

bootstrap();
