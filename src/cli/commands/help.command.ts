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
    ${chalk.blue('--import')} ${chalk.cyan('<path> <login> <password> <host> <dbname> <salt>')}: ${chalk.gray('# импортирует данные из TSV')}
                                                                  ${chalk.gray('path - путь к TSV файлу')}
                                                                  ${chalk.gray('login - логин для подключения к БД')}
                                                                  ${chalk.gray('password - пароль для подключения к БД')}
                                                                  ${chalk.gray('host - хост для подключения к БД')}
                                                                  ${chalk.gray('dbname - имя базы данных')}
                                                                  ${chalk.gray('salt - соль для хеширования паролей')}
    ${chalk.blue('--generate')} ${chalk.cyan('<count> <filepath> <url>')}: ${chalk.gray('# генерирует тестовые данные в TSV-файл')}
                                            ${chalk.gray('count - количество генерируемых записей')}
                                            ${chalk.gray('filepath - путь к файлу для сохранения данных')}
                                            ${chalk.gray('url - адрес для загрузки исходных данных')}
    `));
  }
}
