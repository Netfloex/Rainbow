import { inspect } from "util"

import { createHash } from "@utils/createHash"
import { createWordFromNumber } from "@utils/createWordFromNumber"

for (let i = 0; i <= 1000; i++) {
	const word = createWordFromNumber(i)
	console.log(i, inspect(word), createHash(word))
}
