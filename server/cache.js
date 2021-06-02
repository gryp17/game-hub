import NodeCache from 'node-cache';
import _ from 'lodash';

const cache = new NodeCache();
const userStatusPrefix = 'user-status:';
const pendingChallengePrefix = 'pending-challenge:';

function getUserStatuses() {
	const statuses = {};

	//get all user-status: keys
	const keys = cache.keys().filter((key) => {
		return key.indexOf(userStatusPrefix) === 0;
	});

	const results = cache.mget(keys);

	//format the data and add it to the statuses object
	_.forOwn(results, (value, key) => {
		const id = key.replace(userStatusPrefix, '');
		statuses[id] = value;
	});

	return statuses;
}

function setUserStatus(userId, status) {
	const key = userStatusPrefix + userId;

	if (status === 'offline') {
		cache.del(key);
	} else {
		cache.set(key, status);
	}
}

function getPendingChallenge(id) {
	const key = cache.keys().find((key) => {
		return key.indexOf(pendingChallengePrefix) === 0 && key.indexOf(`[${id}]`) !== -1;
	});

	if (!key) {
		return null;
	}

	return cache.get(key);
}

function addPendingChallenge(from, to) {
	const key = `${pendingChallengePrefix}[${from}]-[${to}]`;
	cache.set(key, {
		from,
		to
	}, 60);
}

function deletePendingChallenge(id) {
	const key = cache.keys().find((key) => {
		return key.indexOf(pendingChallengePrefix) === 0 && key.indexOf(`[${id}]`) !== -1;
	});

	if (key) {
		cache.del(key);
	}
}

export default {
	getUserStatuses,
	setUserStatus,
	getPendingChallenge,
	addPendingChallenge,
	deletePendingChallenge
};
