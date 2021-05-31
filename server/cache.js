import NodeCache from 'node-cache';
import _ from 'lodash';

const cache = new NodeCache();
const userStatusPrefix = 'user-status:';

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

export default {
	getUserStatuses,
	setUserStatus
};
