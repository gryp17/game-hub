export default {
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
};
