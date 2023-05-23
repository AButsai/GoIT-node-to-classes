import dotenv from 'dotenv'
import { DataSource } from 'typeorm'
import { getDirname } from './utils/utils.js'

dotenv.config()

const { POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env
const __dirname = getDirname(import.meta.url)

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: POSTGRES_PORT as unknown as number,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  synchronize: true,
  logging: true,
  entities: ['/src/entity/**/*{.ts,.js}'],
  subscribers: [],
  migrations: ['/src/migrations/**/*{.ts,.js}'],
})
