/**
 * Maps the game code to it's label and icon
 * @param {String} gameCode
 * @returns {Object}
 */
export default (gameCode) => {
	const games = {
		any: {
			value: 'any',
			label: 'Any game',
			icon: 'fas fa-dice'
		},
		pong: {
			value: 'pong',
			label: 'Pong',
			icon: 'fas fa-table-tennis'
		}
	};

	return games[gameCode];
};
