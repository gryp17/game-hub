const port = 4000;

module.exports = {
	port,
	cdn: `http://127.0.0.1:${port}`,
	session: {
		secret: 'EXxCP8sDAfPM7vJ4z6MQeN7oJzSBSh8NKGuSiNCs32qjngaRPC0IgiABV7MpCYu',
		sessionId: 'gamehub.sid',
		tableName: 'session'
	},
	db: {
		host: '127.0.0.1',
		database: 'game-hub',
		user: 'root',
		password: '1234'
	},
	uploads: {
		avatars: {
			directory: '../uploads/avatars/',
			maxSize: 1000000,
			validExtensions: ['png', 'jpg', 'jpeg'],
			defaultAvatar: 'default.png'
		}
	},
	minPasswordLength: 6,
	maxMessagesPerRequest: 30,
	errorCodes: {
		required: 'required',
		invalidBoolean: 'invalid_boolean',
		invalidInteger: 'invalid_integer',
		invalidEmail: 'invalid_email',
		strongPasswordLength: 'strong_password_length_', //strong_password_length_(\d+)
		exceedsMaxFileSize: 'exceeds_max_file_size_', //exceeds_max_file_size_(\d+)
		invalidFileExtension: 'invalid_file_extension_', //invalid_file_extension_[]
		belowCharacters: 'below_characters_', //below_characters_(\d+)
		exceedsCharacters: 'exceeds_characters_', //exceeds_characters_(\d+)
		fieldsDontMatch: 'fields_dont_match',
		notInList: 'not_in_list_', //not_in_list_[]
		alreadyInUse: 'already_in_use',
		wrongPassword: 'wrong_password',
		// api error codes
		invalidAuthenticationToken: 'invalid_authentication_token',
		invalidUserId: 'invalid_user_id',
		challengeNotFound: 'challenge_not_found'
	},
	socketEvents: {
		connection: 'connection',
		disconnect: 'disconnect',
		error: 'error',
		lobby: {
			newUser: 'newUser',
			updateUser: 'updateUser',
			updateUserStatuses: 'updateUserStatuses',
			challenge: 'challenge',
			cancelChallenge: 'cancelChallenge',
			declineChallenge: 'declineChallenge',
			foundMatch: 'foundMatch',
			cancelMatchmakingChallenge: 'cancelMatchmakingChallenge',
			goToGame: 'goToGame',
			newMessage: 'newMessage'
		},
		game: {
			updateInputs: 'updateInputs',
			startGame: 'startGame',
			updateData: 'updateData',
			gameOver: 'gameOver',
			exitGame: 'exitGame'
		}
	},
	gameModes: {
		challenge: 'challenge',
		matchmaking: 'matchmaking'
	},
	userStatuses: {
		online: 'online',
		offline: 'offline',
		busy: 'busy',
		matchmaking: 'matchmaking',
		pong: 'pong'
	},
	gameStatuses: {
		pending: 'pending',
		inProgress: 'in-progress',
		finished: 'finished'
	},
	experienceRewards: {
		win: 10,
		loss: 1
	},
	games: {
		pong: {
			code: 'pong',
			maxPlayers: 2,
			fps: 60,
			width: 1366,
			height: 768,
			maxScore: 10,
			ball: {
				size: 60,
				initialSpeed: 9,
				acceleration: 0.5,
				initialRotationSpeed: 5,
				rotationAcceleration: 1
			},
			paddle: {
				size: 30, //% of the canvas height
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
			},
			configurableSettings: {
				gameLength: {
					short: 5,
					normal: 10,
					long: 20
				},
				paddleSize: {
					big: 40,
					normal: 30,
					small: 20
				},
				ballSpeed: {
					slow: 6,
					normal: 9,
					fast: 11
				},
				ballSize: {
					big: 90,
					normal: 60,
					small: 40
				}
			}
		}
	}
};
