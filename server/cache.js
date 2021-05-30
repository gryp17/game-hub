import NodeCache from 'node-cache';

const cache = new NodeCache();
cache.set('userStatuses', {});

function getUserStatuses() {
	return cache.get('userStatuses');
}

function setUserStatus(userId, status) {
	const statuses = getUserStatuses();

	if (status === 'offline') {
		delete statuses[userId];
	} else {
		statuses[userId] = status;
	}

	cache.set('userStatuses', statuses);
}

export default {
	getUserStatuses,
	setUserStatus
};
