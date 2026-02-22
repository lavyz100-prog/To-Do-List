import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerAs } from '@nestjs/config';

// database.config.ts
export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASS ?? 'yourpassword',
  database: process.env.DB_NAME ?? 'todoapp',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
}));
