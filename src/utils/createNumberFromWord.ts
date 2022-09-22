import { characters } from "@utils/characters"

export const createNumberFromWord = (word: string): number => {
	let totalValue = 0

	for (let i = word.length - 1; i >= 0; i--) {
		const char = word.charAt(i)
		let value = characters.indexOf(char)
		const worth = word.length - i - 1
		if (worth >= 1) value++
		totalValue += value * Math.pow(characters.length, worth)
	}

	return totalValue
}
