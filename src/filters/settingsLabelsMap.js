/**
 * Maps the setting property to it's label
 * @param {String} property
 * @param {String} game
 * @returns {String}
 */
export default (property, game) => {
	//TODO: add more games if necessary
	const settings = {
		pong: {
			gameLength: 'Game length',
			ballSpeed: 'Ball speed',
			ballSize: 'Ball size',
			paddleSize: 'Paddle size'
		},
		volley: {
			gameLength: 'Game length',
			background: 'Background',
			netHeight: 'Net height',
			hitLimit: 'Hit limit'
		}
	};

	return settings[game][property];
};
