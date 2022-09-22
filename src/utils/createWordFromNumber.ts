import { characters } from "@utils/characters"

export const createWordFromNumber = (i: number): string => {
	const division = Math.floor(i / characters.length)
	const remainder = i % characters.length

	return (
		(division == 0 ? "" : createWordFromNumber(division - 1)) +
		characters[remainder]
	)
}
