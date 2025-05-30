import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DbEnvs } from 'src/config';

config();

export const options: DataSourceOptions & SeederOptions = {
  type: 'postgres' as const,
  host: process.env.DB_HOST,
  port: +DbEnvs.dbPort,
  database: DbEnvs.dbDatabase,
  username: DbEnvs.dbUsername,
  password: DbEnvs.dbPassword,
  entities: ['dist/persons/entities/**/*.entity.js', 'dist/affiliates/entities/**/*.entity.js'],
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),

  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  seedTracking: true,

  schema: 'beneficiaries',
  migrations: ['dist/database/migrations/**/*{.ts,.js}'],
};

export default new DataSource(options);
