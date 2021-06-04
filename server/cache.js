const cache = {
	userStatus: {},
	pendingChallenge: {},
	matchmaking: {}
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

function getMatchmakingEntries() {
	return cache.matchmaking;
}

function addMatchmakingEntry(userId, data) {
	cache.matchmaking[userId] = data;
}

function removeMatchmakingEntry(userId) {
	delete cache.matchmaking[userId];
}

export default {
	getUserStatuses,
	setUserStatus,
	getPendingChallenge,
	addPendingChallenge,
	deletePendingChallenge,
	getMatchmakingEntries,
	addMatchmakingEntry,
	removeMatchmakingEntry
};
