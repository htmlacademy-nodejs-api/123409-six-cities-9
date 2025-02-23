export interface FileWriter {
  write(data: string): Promise<unknown>;
}

