import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type RestSchema = {
    PORT: number;
    SALT: string | null;
    DB_HOST: string;
}


export const restSchema = convict({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 5000,
  },
  SALT: {
    doc: 'Salt for password hash',
    format: String,
    env: 'SALT',
    default: null,
  },
  DB_HOST: {
    doc: 'Database host',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1',
  }
});
