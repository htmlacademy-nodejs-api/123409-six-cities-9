import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Command } from './command.interface.js';
import { Offer } from '../../shared/types/offer.type.js';
import { DatabaseClient } from '../../shared/libs/database-client/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { OfferService } from '../../shared/modules/offer/index.js';
import { UserService } from '../../shared/modules/user/index.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.constants.js';
import { getMongoURI } from '../../shared/helpers/database.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../shared/types/component.enum.js';

@injectable()
export class ImportCommand implements Command {

  private salt: string;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    this.onImportedOffer = this.onImportedOffer.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);
  }


  private async onImportedOffer(offer: Offer, resolve: () => void) {
    await this.saveOffer(offer);
    this.logger.info(`Offer ${offer.title} imported.`);
    resolve();
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({
      ...offer.user,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    this.logger.info(JSON.stringify(user));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user: _, ...offerData } = offer;

    await this.offerService.create({
      userId: user.id,
      ...offerData,
    });
  }

  private onCompleteImport(count: number) {
    this.logger.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  public getName(): string {
    return '--import';
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedOffer.bind(this));
    fileReader.on('end', this.onCompleteImport.bind(this));

    try {
      fileReader.read();
    } catch (error) {
      await this.databaseClient.disconnect();
      console.error(`Can't import data from file: ${filename}`);
      console.error(`Details: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  }
}
