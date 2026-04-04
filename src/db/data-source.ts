import { DataSource } from 'typeorm';
import 'dotenv/config';

const isSslEnabled = process.env.POSTGRES_SSL === 'true';

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: String(process.env.POSTGRES_PASSWORD),
  database: process.env.POSTGRES_NAME,
  entities: [__dirname + '/../modules/**/*.entity{.js,.ts}'],
  migrations: [__dirname + '/migrations/**/*{.js,.ts}'],
  logging: true,
  ssl: isSslEnabled ? { rejectUnauthorized: false } : false,
});
