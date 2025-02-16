import { CLIApplication, VersionCommand, HelpCommand, ImportCommand } from './cli/index.js';

function bootstrap(): void {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
  ]);
  cliApplication.processCommand(process.argv);
}

bootstrap();
