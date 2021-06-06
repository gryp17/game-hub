import cache from './cache';

let intervalId = null;

function getAvailableUsers() {
	const users = Object.values(cache.getMatchmakingEntries());

	return users.sort((a, b) => {
		return a.joined - b.joined;
	});
}

function join(userId) {
	cache.addMatchmakingEntry(userId, {
		id: userId,
		joined: new Date()
	});
}

function leave(userId) {
	cache.deleteMatchmakingEntry(userId);
}

function startService(matchFound, interval = 5000) {
	intervalId = setInterval(() => {
		const users = getAvailableUsers();

		console.log(users);

		//match the available users
		while (users.length > 1) {
			const matchedUsers = [
				users[0].id,
				users[1].id
			];

			//remove both users from the matchmaking and from the users list
			matchedUsers.forEach((userId) => {
				leave(userId);
				users.shift();
			});

			//add the cache entry for this match/challenge
			cache.addMatchmakingChallenge(...matchedUsers);

			//notify the socket server or whatever about this match
			matchFound(...matchedUsers);
		}
	}, interval);
}

function stopService() {
	clearInterval(intervalId);
}

function hasJoinedMatchmaking(userId) {
	const entry = cache.getMatchmakingEntry(userId);
	return !!entry;
}

export default {
	startService,
	stopService,
	hasJoinedMatchmaking,
	join,
	leave
};
