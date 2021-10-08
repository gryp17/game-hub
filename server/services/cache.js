import { userStatuses } from '../config';

const cache = {
	userStatus: {},
	pendingChallenge: {},
	matchmaking: {},
	matchmakingChallenge: {},
	gameState: {}
};

/**
 * Returns all user's statuses
 * @returns {Object}
 */
function getUserStatuses() {
	return cache.userStatus;
}

/**
 * Sets a specific user's status
 * @param {Number} userId
 * @param {String} status
 */
function setUserStatus(userId, status) {
	if (status === userStatuses.offline) {
		delete cache.userStatus[userId];
	} else {
		cache.userStatus[userId] = status;
	}
}

/**
 * Returns the key of the first pending challenge that the provided user is a part of
 * @param {Number} userId
 * @returns {String}
 */
function findPendingChallengeKey(userId) {
	return Object.keys(cache.pendingChallenge).find((key) => {
		return key.indexOf(`[${userId}]`) !== -1;
	});
}

/**
 * Returns the pending challenge that the provided user is a part of
 * @param {Number} userId
 * @returns {Object}
 */
function getPendingChallenge(userId) {
	const key = findPendingChallengeKey(userId);

	if (!key) {
		return null;
	}

	return cache.pendingChallenge[key];
}

/**
 * Adds a new pending challenge
 * @param {Object} from
 * @param {Object} to
 * @param {String} game
 * @param {Object} settings
 */
function addPendingChallenge(from, to, game, settings) {
	const key = `[${from.id}]-[${to.id}]`;

	cache.pendingChallenge[key] = {
		from,
		to,
		game,
		settings
	};
}

/**
 * Deletes the pending challenge that the provided user is a part of
 * @param {Number} userId
 */
function deletePendingChallenge(userId) {
	const key = findPendingChallengeKey(userId);

	if (key) {
		delete cache.pendingChallenge[key];
	}
}

/**
 * Returns the matchmaking entry that the provided user is a part of
 * @param {Number} userId
 * @returns {Object}
 */
function getMatchmakingEntry(userId) {
	return cache.matchmaking[userId];
}

/**
 * Returns all matchmaking entries
 * @returns {Object}
 */
function getMatchmakingEntries() {
	return cache.matchmaking;
}

/**
 * Adds a new matchmaking entry
 * @param {Number} userId
 * @param {Object} data
 */
function addMatchmakingEntry(userId, data) {
	cache.matchmaking[userId] = data;
}

/**
 * Deletes the user's matchmaking entry
 * @param {Number} userId
 */
function deleteMatchmakingEntry(userId) {
	delete cache.matchmaking[userId];
}

/**
 * Adds a new matchmaking challenge
 * @param {Object} userA
 * @param {Object} userB
 * @param {String} game
 */
function addMatchmakingChallenge(userA, userB, game) {
	const key = `[${userA.id}]-[${userB.id}]`;

	cache.matchmakingChallenge[key] = {
		game,
		players: {
			[userA.id]: {
				id: userA.id,
				accepted: false,
				socketId: userA.socketId
			},
			[userB.id]: {
				id: userB.id,
				accepted: false,
				socketId: userB.socketId
			}
		}
	};
}

/**
 * Returns the matchmaking challenge key that the provided user belongs to
 * @param {Number} userId
 * @returns {Object}
 */
function findMatchmakingChallenge(userId) {
	return Object.keys(cache.matchmakingChallenge).find((key) => {
		return key.indexOf(`[${userId}]`) !== -1;
	});
}

/**
 * Returns the matchmaking challenge that the provided user belongs to
 * @param {Number} userId
 * @returns {Object}
 */
function getMatchmakingChallenge(userId) {
	const key = findMatchmakingChallenge(userId);

	if (!key) {
		return null;
	}

	return cache.matchmakingChallenge[key];
}

/**
 * Updates the matchmaking challenge that the provided user belongs to
 * @param {Number} userId
 * @param {Boolean} accepted
 */
function updateMatchmakingChallenge(userId, accepted) {
	const key = findMatchmakingChallenge(userId);

	if (key) {
		cache.matchmakingChallenge[key].players[userId].accepted = accepted;
	}
}

/**
 * Deletes the matchmaking challenge that the provided user belongs to
 * @param {Number} userId
 */
function deleteMatchmakingChallenge(userId) {
	const key = findMatchmakingChallenge(userId);

	delete cache.matchmakingChallenge[key];
}

/**
 * Adds a new game state
 * @param {Number} gameId
 * @param {Object} game
 */
function addGameState(gameId, game) {
	const key = gameId;
	cache.gameState[key] = game;
}

/**
 * Returns the game state that matches the provided game id
 * @param {Number} gameId
 * @returns {Object}
 */
function findGameStateById(gameId) {
	const key = gameId;
	return cache.gameState[key];
}

/**
 * Returns the game state that the provided user is a part of
 * @param {Number} userId
 * @returns {Object}
 */
function findGameStateByUserId(userId) {
	return Object.values(cache.gameState).find((game) => {
		return game.players.some((player) => {
			return player.id === userId;
		});
	});
}

/**
 * Deletes the game state that matches the provided game id
 * @param {Number} gameId
 */
function deleteGameState(gameId) {
	const key = gameId;
	delete cache.gameState[key];
}

export default {
	getUserStatuses,
	setUserStatus,
	getPendingChallenge,
	addPendingChallenge,
	deletePendingChallenge,
	getMatchmakingEntry,
	getMatchmakingEntries,
	addMatchmakingEntry,
	deleteMatchmakingEntry,
	addMatchmakingChallenge,
	getMatchmakingChallenge,
	updateMatchmakingChallenge,
	deleteMatchmakingChallenge,
	addGameState,
	findGameStateById,
	findGameStateByUserId,
	deleteGameState
};
