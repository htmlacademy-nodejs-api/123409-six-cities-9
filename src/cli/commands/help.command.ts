import chalk from 'chalk';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(chalk.gray(`
        ${chalk.bold('Программа для подготовки данных для REST API сервера.')}
        ${chalk.yellow('Пример:')}
            ${chalk.green('main.cli.js')} ${chalk.blue('--<command>')} ${chalk.cyan('[--arguments]')}
        ${chalk.yellow('Команды:')}
            ${chalk.blue('--version')}:                   ${chalk.gray('# выводит номер версии')}
            ${chalk.blue('--help')}:                      ${chalk.gray('# печатает этот текст')}
            ${chalk.blue('--import')} ${chalk.cyan('<path>')}:             ${chalk.gray('# импортирует данные из TSV')}
    `));
  }
}
