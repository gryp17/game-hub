import { userStatuses } from '../config';

const cache = {
	userStatus: {},
	pendingChallenge: {},
	matchmaking: {},
	matchmakingChallenge: {},
	game: {}
};

function getUserStatuses() {
	return cache.userStatus;
}

function setUserStatus(userId, status) {
	if (status === userStatuses.OFFLINE) {
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

function addPendingChallenge(from, to, game) {
	const key = `[${from.id}]-[${to.id}]`;

	cache.pendingChallenge[key] = {
		from,
		to,
		game
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

function addRunningGame(gameId, game) {
	const key = gameId;
	cache.game[key] = game;
}

function findRunningGameById(gameId) {
	const key = gameId;
	return cache.game[key];
}

function findRunningGameByUserId(userId) {
	return Object.values(cache.game).find((game) => {
		return game.players.some((player) => {
			return player.id === userId;
		});
	});
}

function deleteRunningGame(gameId) {
	const key = gameId;
	delete cache.game[key];
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
	addRunningGame,
	findRunningGameById,
	findRunningGameByUserId,
	deleteRunningGame
};
