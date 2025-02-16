import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Command } from './command.interface.js';


export class ImportCommand implements Command {


  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(`Details: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  }
}
