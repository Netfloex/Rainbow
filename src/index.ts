import { AppDataSource } from "./data-source"
import { HashedWord } from "@entity/HashedWord"
import { inspect } from "util"

import { createHash } from "@utils/createHash"
import { createWordFromNumber } from "@utils/createWordFromNumber"
import { getStartIndex } from "@utils/getStartIndex"

const TIMING_COUNT = 10000

const main = async (): Promise<void> => {
	await AppDataSource.initialize()
	const hashedWordsRepository = AppDataSource.getRepository(HashedWord)
	const startIndex = await getStartIndex(hashedWordsRepository)
	console.log("Starting at:", startIndex)
	const timings: Array<number> = []

	const created: Array<HashedWord> = []

	const loop = async (index: number): Promise<void> => {
		const word = createWordFromNumber(index)
		const md5 = createHash(word)
		created.push({ index, md5, word })

		// Timings
		timings.push(performance.now())
		let lastThousandTiming = ""
		if (timings.length > TIMING_COUNT) {
			lastThousandTiming = `${(
				(performance.now() - timings.shift()!) /
				1000
			).toFixed(2)}s for ${TIMING_COUNT} items`
		}
		if (index % TIMING_COUNT == 0 || index == startIndex) {
			console.log(index, inspect(word), md5, lastThousandTiming)

			console.log("Loop, putting " + created.length + " inside db...")
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

main().catch((err) => {
	console.log("main() exited with an error:")
	console.error(err)
})
