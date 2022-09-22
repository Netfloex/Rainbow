import { HashedWord } from "@entity/HashedWord"
import { Repository } from "typeorm"

export const getStartIndex = async (
	hashedWordsRepository: Repository<HashedWord>,
): Promise<number> => {
	const highestIndexItem = await hashedWordsRepository.find({
		select: { index: true },
		take: 1,
		order: {
			index: "DESC",
		},
	})
	const highestIndex = highestIndexItem?.[0]?.index
	const startIndex = highestIndex ? highestIndex + 1 : 0

	return startIndex
}
