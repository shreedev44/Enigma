export function generateDailyCounts(
	dataArray: { date: string; count: number }[]
) {
	const dailyCounts = [];
	const today = new Date();
	const oneYearAgo = new Date(today);
	oneYearAgo.setDate(today.getDate() - 364);

	const dataMap = new Map();
	dataArray.forEach((item) => {
		dataMap.set(item.date, item.count);
	});

	for (let i = 0; i < 365; i++) {
		const currentDate = new Date(oneYearAgo);
		currentDate.setDate(oneYearAgo.getDate() + i);
		const dateString = currentDate.toISOString().split("T")[0];

		const count = dataMap.get(dateString) || 0;
		dailyCounts.push({ date: dateString, count });
	}

	return dailyCounts;
}
