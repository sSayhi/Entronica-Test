import { DataSource } from "typeorm";
import "reflect-metadata";
import 'dotenv/config';
import path from "path";

const dbConfig: any = {
  type: 'postgres',
  username: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  schema: 'public',
  synchronize: false,
  logging: false,
  entities: [path.join(__dirname, "..", "entity", "*.{js,ts}")],
  subscribers: [],
  options: {
    encrypt: true,
    trustServerCertificate: true
  },
  requestTimeout: 300000,
  connectionTimeout: 300000,
};

const db = new DataSource(dbConfig);

export async function initDataSource(): Promise<DataSource> {
  if (!db.isInitialized) {
    await db.initialize();
  }
  return db;
}

export default db;