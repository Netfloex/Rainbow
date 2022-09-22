import { AppDataSource } from "./data-source"
import { createNumberFromWord } from "./utils/createNumberFromWord"
import { formatLargeNumber } from "./utils/formatLargeNumber"
import { HashedWord } from "@entity/HashedWord"
import chalk from "chalk"
import { version } from "package.json"
import { inspect } from "util"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"

import { createHash } from "@utils/createHash"
import { createWordFromNumber } from "@utils/createWordFromNumber"
import { getStartIndex } from "@utils/getStartIndex"

const TIMING_COUNT = 10000

const initialize = async (): Promise<void> => {
	!AppDataSource.isInitialized && (await AppDataSource.initialize())
}

const main = async (): Promise<void> => {
	await initialize()
	const hashedWordsRepository = AppDataSource.getRepository(HashedWord)
	const startIndex = await getStartIndex(hashedWordsRepository)

	console.log(chalk`Starting at: {yellow ${formatLargeNumber(startIndex)}}`)

	const timings: Array<number> = []
	const created: Array<HashedWord> = []

	const loop = async (index: number): Promise<void> => {
		const word = createWordFromNumber(index)
		const md5 = createHash(word)
		created.push({ index, md5 })

		// Timings
		timings.push(performance.now())
		if (timings.length > TIMING_COUNT) {
			timings.shift()
		}

		if (index % TIMING_COUNT == 0 || index == startIndex) {
			const msDifference = performance.now() - timings[0]!
			const msDifferenceAvg = msDifference / timings.length
			const lastThousandTiming = chalk`{cyan ${formatLargeNumber(
				1000 / msDifferenceAvg,
			)} ops/s} {magenta ${formatLargeNumber(msDifferenceAvg)}ms}`

			console.log(
				chalk`{green ${formatLargeNumber(index)}} {yellow ${inspect(
					word,
				)}} {blue ${md5}} ${lastThousandTiming}`,
			)

			await hashedWordsRepository
				.createQueryBuilder()
				.insert()
				.values(created)
				.execute()
			created.length = 0
		}

		// Loop
		setImmediate(() => loop(index + 1))
	}

	await loop(startIndex)
}

const startMain = (): void => {
	main().catch((err) => {
		console.log("main() exited with an error:")
		console.error(err)
	})
}

yargs(hideBin(process.argv))
	.scriptName("rainbow")
	.version(version)
	// .help()
	.alias("h", "help")
	.alias("v", "version")
	.command("run", "Fills the table with more data", {}, () => startMain())
	.command(
		"search",
		"Search for a hash in the database",
		(yargs) =>
			yargs.options({
				md5: {
					type: "string",
					alias: "m",
					required: true,
				},
			}),
		async ({ md5 }) => {
			await initialize()
			const result = await AppDataSource.manager.findOneBy(HashedWord, {
				md5,
			})

			if (!result) {
				console.log(chalk`{red No result has been found.}`)
			} else {
				console.log({
					hash: result.md5,
					index: formatLargeNumber(result.index),
					word: createWordFromNumber(result.index),
				})
			}
		},
	)
	.command(
		"hash",
		"Hashes a string",
		(yargs) =>
			yargs.options({
				md5: {
					alias: "m",
					required: true,
					type: "string",
				},
			}),
		({ md5 }) => {
			console.log(chalk`md5 hash of {dim ${inspect(md5)}}`)

			console.log(chalk.yellow(createHash(md5)))
		},
	)
	.command(
		"convert",
		"Converts a string to a number or vice-versa",
		(yargs) =>
			yargs.options({
				string: {
					alias: "s",
					type: "string",
				},
				index: {
					alias: ["i", "n", "number"],
					type: "number",
				},
			}),
		(args) => {
			if ([args.index, args.string].filter(Boolean).length != 1) {
				return console.log(chalk.red("Invalid number of arguments"))
			}
			if (args.index) {
				console.log(
					chalk`Converting: {dim ${inspect(args.index)}} to a word:`,
				)

				return console.log(
					chalk.yellow(inspect(createWordFromNumber(args.index))),
				)
			} else if (args.string) {
				console.log(
					chalk`Converting: {dim ${inspect(
						args.string,
					)}} to a number:`,
				)

				return console.log(
					chalk.yellow(
						formatLargeNumber(createNumberFromWord(args.string)),
					),
				)
			}
		},
	)
	.command("stats", "Shows stats", async () => {
		await initialize()
		const count = await AppDataSource.manager.count(HashedWord)
		console.log(
			chalk`Currently storing {yellow {bold ${formatLargeNumber(
				count,
			)}}} rows, the last item should be: {yellow ${inspect(
				createWordFromNumber(count),
			)}}`,
		)
	})
	.strict()
	.demandCommand()
	.parse()
