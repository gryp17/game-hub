import cache from './cache';

let intervalId = null;

function getAvailableUsers() {
	const users = Object.values(cache.getMatchmakingEntries());

	return users.sort((a, b) => {
		return a.joined - b.joined;
	});
}

function startService(matchFound, interval = 5000) {
	intervalId = setInterval(() => {
		const users = getAvailableUsers();

		//TODO: loop through the users starting from the last user and match him with the next one in the list

		console.log(users);
	}, interval);
}

function stopService() {
	clearInterval(intervalId);
}

function join(userId) {
	cache.addMatchmakingEntry(userId, {
		id: userId,
		joined: new Date()
	});
}

function leave(userId) {
	cache.removeMatchmakingEntry(userId);
}

export default {
	startService,
	stopService,
	join,
	leave
};
