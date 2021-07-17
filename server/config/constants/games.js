export default {
	PONG: {
		code: 'pong',
		maxPlayers: 2,
		fps: 60,
		width: 1024,
		height: 768,
		maxScore: 5,
		ball: {
			size: 60,
			initialSpeed: 7,
			acceleration: 0.5
		},
		paddle: {
			acceleration: 2,
			maxSpeed: 8
		},
		controls: {
			up: {
				keys: [38, 87] //arrow up, W
			},
			down: {
				keys: [40, 83] //arrow down, S
			}
		}
	}
};
