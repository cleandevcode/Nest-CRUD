import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { join } from 'path';
import * as PostgresConnectionStringParser from 'pg-connection-string';
import * as DotEnv from 'dotenv';

DotEnv.config();
const connectionOptions = PostgresConnectionStringParser.parse(
  process.env.DATABASE_URL,
);

const dbConfig = config.get('db');
  
const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: connectionOptions.host,
  port: Number(connectionOptions.port),
  username: connectionOptions.user,
  password: connectionOptions.password,
  database: connectionOptions.database,
  entities: [join(__dirname, '..', '..', 'modules', '**', '*.entity.{js,ts}')],
  // seeds: ['src/seeds/**/*{.ts,.js}'],
  // factories: ['src/factories/**/*{.ts,.js}'],
  synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
  migrationsRun: dbConfig.migrationsRun,
  migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
  cli: {
      migrationsDir: join('src', 'database' ,'migrations')
  }
};

module.exports = typeOrmConfig;
