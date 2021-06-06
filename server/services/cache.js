const cache = {
	userStatus: {},
	pendingChallenge: {},
	matchmaking: {},
	matchmakingChallenge: {}
};

function getUserStatuses() {
	return cache.userStatus;
}

function setUserStatus(userId, status) {
	if (status === 'offline') {
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

function addPendingChallenge(from, to) {
	const key = `[${from.id}]-[${to.id}]`;

	cache.pendingChallenge[key] = {
		from,
		to
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

function addMatchmakingChallenge(userIdA, userIdB) {
	const key = `[${userIdA}]-[${userIdB}]`;

	cache.matchmakingChallenge[key] = {
		[userIdA]: false,
		[userIdB]: false
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

function updateMatchmakingChallenge(userId, status) {
	const key = findMatchmakingChallenge(userId);

	if (key) {
		cache.matchmakingChallenge[key][userId] = status;
	}
}

function deleteMatchmakingChallenge(userId) {
	const key = findMatchmakingChallenge(userId);

	delete cache.matchmakingChallenge[key];
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
	deleteMatchmakingChallenge
};
