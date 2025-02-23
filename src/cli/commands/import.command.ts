import chalk from 'chalk';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Command } from './command.interface.js';
import { Offer } from '../../shared/types/offer.type.js';


export class ImportCommand implements Command {

  private offerCount = 0;

  private onImportedOffer(offer: Offer): void {
    if(this.offerCount === 0) {
      console.log(chalk.blue('Import result:'));
    }
    this.offerCount++;
    console.log(chalk.green(`${this.offerCount}. ${offer.title}`));
    console.log(chalk.gray(`   Description: ${offer.description}`));
    console.log(chalk.gray(`   Date: ${chalk.yellow(offer.date.toISOString())}`));
    console.log(chalk.gray(`   City: ${chalk.magenta(offer.city)}`));
    console.log(chalk.gray(`   Preview Image: ${chalk.cyan(offer.previewImage)}`));
    console.log(chalk.gray(`   Images: ${chalk.cyan(offer.images.join(', '))}`));
    console.log(chalk.gray(`   Premium: ${chalk.yellow(offer.isPremium)}`));
    console.log(chalk.gray(`   Favorite: ${chalk.yellow(offer.isFavorite)}`));
    console.log(chalk.gray(`   Rating: ${chalk.yellow(offer.rating)}`));
    console.log(chalk.gray(`   Type: ${chalk.cyan(offer.type)}`));
    console.log(chalk.gray(`   Bedrooms: ${chalk.yellow(offer.bedrooms)}`));
    console.log(chalk.gray(`   Max Adults: ${chalk.yellow(offer.maxAdults)}`));
    console.log(chalk.gray(`   Price: ${chalk.yellow(offer.price)}`));
    console.log(chalk.gray(`   Comforts: ${chalk.cyan(offer.comforts.join(', '))}`));
    console.log(chalk.gray(`   Host: ${chalk.cyan(offer.host)}`));
    console.log(chalk.gray(`   Comments Count: ${chalk.yellow(offer.commentsCount)}`));
    console.log(chalk.gray(`   Coordinates: ${chalk.yellow(offer.coordinates.join(', '))}`));
    console.log();
  }

  private onCompleteImport(): void {
    console.log(chalk.green(`${this.offerCount} offers imported.`));
  }

  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedOffer.bind(this));
    fileReader.on('end', this.onCompleteImport.bind(this));

    try {
      fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(`Details: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  }
}
