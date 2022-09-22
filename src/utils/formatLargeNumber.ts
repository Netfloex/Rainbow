const formatter = new Intl.NumberFormat("en-US")

export const formatLargeNumber = (count: number): string => {
	return formatter.format(count)
}
