import { games } from '../config';

/**
 * Calculates the user's game stats
 * @param {Number} userId
 * @param {Array} finishedGames
 * @returns {Object}
 */
function calculateGameStats(userId, finishedGames) {
	const total = finishedGames.length;
	let won = 0;
	let lost = 0;
	let ragequit = 0;

	const byType = {};

	//generate the byType object
	Object.keys(games).forEach((key) => {
		const code = games[key].code;
		byType[code] = 0;
	});

	finishedGames.forEach((game) => {
		if (game.winner === userId) {
			won++;
		} else {
			if (game.ragequit) {
				ragequit++;
			}

			lost++;
		}

		byType[game.type]++;
	});

	//calculate the ragequit percentage
	const ragequitPercentage = ragequit > 0 ? Math.floor((100 / total) * ragequit) : 0;

	return {
		total,
		won,
		lost,
		ragequit,
		ragequitPercentage,
		byType
	};
}

export {
	calculateGameStats
};
