import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptionst: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: 5432,
  username: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASS || 'root',
  database: process.env.POSTGRES_DATABASE || 'marketplace',
  entities: ['dist/**/*entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  migrationsRun: true,
  logging: ['warn', 'error'],
};

export const dataSourse = new DataSource(dataSourceOptionst);
