/**
 * Maps the game code to it's label and icon
 * @param {String} gameCode
 * @returns {Object}
 */
export default (gameCode) => {
	//TODO: add more games if necessary
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
		},
		volley: {
			value: 'volley',
			label: 'Volley',
			icon: 'fas fa-volleyball-ball'
		},
		jumper: {
			value: 'jumper',
			label: 'Jumper',
			icon: 'fas fa-running'
		}
	};

	return games[gameCode];
};
