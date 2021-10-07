import { userStatuses } from '../config';

const cache = {
	userStatus: {},
	pendingChallenge: {},
	matchmaking: {},
	matchmakingChallenge: {},
	gameState: {}
};

function getUserStatuses() {
	return cache.userStatus;
}

function setUserStatus(userId, status) {
	if (status === userStatuses.offline) {
		delete cache.userStatus[userId];
	} else {
		cache.userStatus[userId] = status;
	}
}

function findPendingChallengeKey(userId) {
	return Object.keys(cache.pendingChallenge).find((key) => {
		return key.indexOf(`[${userId}]`) !== -1;
	});
}

function getPendingChallenge(userId) {
	const key = findPendingChallengeKey(userId);

	if (!key) {
		return null;
	}

	return cache.pendingChallenge[key];
}

function addPendingChallenge(from, to, game, settings) {
	const key = `[${from.id}]-[${to.id}]`;

	cache.pendingChallenge[key] = {
		from,
		to,
		game,
		settings
	};
}

function deletePendingChallenge(userId) {
	const key = findPendingChallengeKey(userId);

	if (key) {
		delete cache.pendingChallenge[key];
	}
}

function getMatchmakingEntry(userId) {
	return cache.matchmaking[userId];
}

function getMatchmakingEntries() {
	return cache.matchmaking;
}

function addMatchmakingEntry(userId, data) {
	cache.matchmaking[userId] = data;
}

function deleteMatchmakingEntry(userId) {
	delete cache.matchmaking[userId];
}

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

function findMatchmakingChallenge(userId) {
	return Object.keys(cache.matchmakingChallenge).find((key) => {
		return key.indexOf(`[${userId}]`) !== -1;
	});
}

function getMatchmakingChallenge(userId) {
	const key = findMatchmakingChallenge(userId);

	if (!key) {
		return null;
	}

	return cache.matchmakingChallenge[key];
}

function updateMatchmakingChallenge(userId, accepted) {
	const key = findMatchmakingChallenge(userId);

	if (key) {
		cache.matchmakingChallenge[key].players[userId].accepted = accepted;
	}
}

function deleteMatchmakingChallenge(userId) {
	const key = findMatchmakingChallenge(userId);

	delete cache.matchmakingChallenge[key];
}

function addGameState(gameId, game) {
	const key = gameId;
	cache.gameState[key] = game;
}

function findGameStateById(gameId) {
	const key = gameId;
	return cache.gameState[key];
}

function findGameStateByUserId(userId) {
	return Object.values(cache.gameState).find((game) => {
		return game.players.some((player) => {
			return player.id === userId;
		});
	});
}

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
