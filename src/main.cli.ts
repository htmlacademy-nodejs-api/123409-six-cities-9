#!/usr/bin/env node
import { CLIApplication, VersionCommand, HelpCommand, ImportCommand, GenerateCommand } from './cli/index.js';

function bootstrap(): void {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
    new GenerateCommand(),
  ]);
  cliApplication.processCommand(process.argv);
}

bootstrap();
