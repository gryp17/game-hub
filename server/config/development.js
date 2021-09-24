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
		REQUIRED: 'required',
		INVALID_BOOLEAN: 'invalid_boolean',
		INVALID_INTEGER: 'invalid_integer',
		INVALID_EMAIL: 'invalid_email',
		STRONG_PASSWORD_LENGTH_: 'strong_password_length_', //strong_password_length_(\d+)
		EXCEEDS_MAX_FILE_SIZE_: 'exceeds_max_file_size_', //exceeds_max_file_size_(\d+)
		INVALID_FILE_EXTENSION_: 'invalid_file_extension_', //invalid_file_extension_[]
		BELOW_CHARACTERS_: 'below_characters_', //below_characters_(\d+)
		EXCEEDS_CHARACTERS_: 'exceeds_characters_', //exceeds_characters_(\d+)
		FIELDS_DONT_MATCH: 'fields_dont_match',
		NOT_IN_LIST_: 'not_in_list_', //not_in_list_[]
		ALREADY_IN_USE: 'already_in_use',
		WRONG_PASSWORD: 'wrong_password',
		// api error codes
		INVALID_AUTHENTICATION_TOKEN: 'invalid_authentication_token',
		INVALID_USER_ID: 'invalid_user_id',
		CHALLENGE_NOT_FOUND: 'challenge_not_found'
	},
	socketEvents: {
		CONNECTION: 'connection',
		DISCONNECT: 'disconnect',
		ERROR: 'error',
		LOBBY: {
			NEW_USER: 'newUser',
			UPDATE_USER: 'updateUser',
			UPDATE_USER_STATUSES: 'updateUserStatuses',
			CHALLENGE: 'challenge',
			CANCEL_CHALLENGE: 'cancelChallenge',
			DECLINE_CHALLENGE: 'declineChallenge',
			FOUND_MATCH: 'foundMatch',
			CANCEL_MATCHMAKING_CHALLENGE: 'cancelMatchmakingChallenge',
			GO_TO_GAME: 'goToGame',
			NEW_MESSAGE: 'newMessage'
		},
		GAME: {
			UPDATE_INPUTS: 'updateInputs',
			START_GAME: 'startGame',
			UPDATE_DATA: 'updateData',
			GAME_OVER: 'gameOver',
			EXIT_GAME: 'exitGame'
		}
	},
	userStatuses: {
		ONLINE: 'online',
		OFFLINE: 'offline',
		BUSY: 'busy',
		MATCHMAKING: 'matchmaking',
		PONG: 'pong'
	},
	gameStatuses: {
		PENDING: 'pending',
		IN_PROGRESS: 'in-progress',
		FINISHED: 'finished'
	},
	experienceRewards: {
		WIN: 10,
		LOSS: 1
	},
	games: {
		PONG: {
			code: 'pong',
			maxPlayers: 2,
			fps: 60,
			width: 1024,
			height: 768,
			maxScore: 10,
			ball: {
				size: 60,
				initialSpeed: 7,
				acceleration: 0.5,
				initialRotationSpeed: 5,
				rotationAcceleration: 1
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
	}
};
