import { HashedWord } from "@entity/HashedWord"
import { DataSource } from "typeorm"

const { env } = process
export const AppDataSource = new DataSource({
	type: (env.DB_TYPE as "postgres") ?? "postgres",
	host: env.HOST ?? "localhost",
	port: parseInt(env.PORT ?? "") || 5432,
	username: env.DB_USERNAME ?? "postgres",
	password: env.DB_PASSWORD ?? "rainbow-table",
	database: env.DB_DATABASE ?? "rainbow",
	synchronize: true,
	logging: true,
	entities: [HashedWord],
	subscribers: [],
	migrations: [],
})
