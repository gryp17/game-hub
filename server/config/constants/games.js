export default {
	PONG: {
		code: 'pong',
		maxPlayers: 2,
		fps: 60,
		width: 1024,
		height: 768,
		maxScore: 1,
		ball: {
			size: 60,
			initialSpeed: 7,
			acceleration: 0.5
		},
		paddle: {
			acceleration: 2,
			maxSpeed: 8
		}
	}
};
