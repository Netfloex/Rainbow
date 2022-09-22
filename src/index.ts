import { AppDataSource } from "./data-source"
import { HashedWord } from "@entity/HashedWord"
import { inspect } from "util"

import { createHash } from "@utils/createHash"
import { createWordFromNumber } from "@utils/createWordFromNumber"
import { getStartIndex } from "@utils/getStartIndex"

const main = async (): Promise<void> => {
	await AppDataSource.initialize()
	const hashedWordsRepository = AppDataSource.getRepository(HashedWord)
	const startIndex = await getStartIndex(hashedWordsRepository)
	const count = 1000

	const started = performance.now()
	for (let i = startIndex; i < startIndex + count; i++) {
		const word = createWordFromNumber(i)
		const md5 = createHash(word)
		console.log(i, inspect(word), md5)
		await hashedWordsRepository.insert({ index: i, md5, word })
	}

	console.log(
		"Currently there are " +
			(await AppDataSource.manager.count(HashedWord)) +
			" rows, inserted " +
			count +
			" rows in " +
			((performance.now() - started) / 1000).toFixed(2) +
			"s",
	)
}

main()
	.then(() => {
		console.log("Done")
	})
	.catch((err) => {
		console.log("main() exited with an error:")
		console.error(err)
	})
