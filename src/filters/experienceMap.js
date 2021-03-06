/**
 * Returns a color depending on the user's level
 * @param {Number} level
 * @param {Number} maxLevel
 * @returns {String}
 */
function calculateColor(level, maxLevel) {
	const minHue = 2;
	const maxHue = 90;
	const huePerLevel = maxHue / maxLevel;
	const midLevel = Math.floor(maxLevel / 2);

	const hue = level === maxLevel ? minHue : maxHue - (huePerLevel * (level - 1));
	const saturation = level > midLevel ? '100%' : '86%';
	const color = `hsl(${hue}, ${saturation}, 67%)`;

	return color;
}

/**
 * Calculates the experience level, color and other data related to the user experience
 * @param {Number} experience
 * @returns {Object}
 */
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

	const currentLevelExperienceValue = experienceLevels[index];
	const lastLevelExperienceValue = experienceLevels[experienceLevels.length - 1];

	//levels
	const level = index + 1;
	const nextLevel = level < maxLevel ? level + 1 : maxLevel;

	//ranges
	const currentLevelExperience = index > 0 ? experienceLevels[index - 1] : 0;
	const nextLevelExperience = index < experienceLevels.length - 1 ? currentLevelExperienceValue : lastLevelExperienceValue;

	//percentage
	const difference = nextLevelExperience - currentLevelExperience;
	const current = experience - currentLevelExperience;
	const percentage = experience >= nextLevelExperience ? 100 : (current * 100) / difference;

	//color
	const color = calculateColor(level, maxLevel);

	return {
		value: experience,
		level,
		nextLevel,
		currentLevelExperience,
		nextLevelExperience,
		percentage: Math.floor(percentage),
		color
	};
};
