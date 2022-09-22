const formatter = new Intl.NumberFormat(
	process.env.NUMBER_FORMAT_LANGUAGE ?? "en-US",
)

export const formatLargeNumber = (count: number): string => {
	return formatter.format(count)
}
