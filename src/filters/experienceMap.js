export default (experience) => {
	const experienceLevels = [
		30,
		90,
		160,
		240,
		340,
		500,
		1000,
		2400,
		5000
	];

	const maxLevel = experienceLevels.length + 1;

	let index = experienceLevels.findIndex((value) => {
		return experience < value;
	});

	//max level reached
	if (index === -1) {
		index = experienceLevels.length;
	}

	//levels
	const level = index + 1;
	const nextLevel = level < maxLevel ? level + 1 : maxLevel;

	//ranges
	const rangeFrom = index > 0 ? experienceLevels[index - 1] : 0;
	const rangeTo = index < experienceLevels.length - 1 ? experienceLevels[index] : experienceLevels[experienceLevels.length - 1];

	//percentage
	const difference = rangeTo - rangeFrom;
	const current = experience - rangeFrom;
	const percentage = experience >= rangeTo ? 100 : (current * 100) / difference;

	return {
		value: experience,
		level,
		nextLevel,
		rangeFrom,
		rangeTo,
		percentage: Math.floor(percentage)
	};
};
