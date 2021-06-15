import cache from './cache';

let intervalId = null;

function getAvailableUsers() {
	const users = Object.values(cache.getMatchmakingEntries());

	return users.sort((a, b) => {
		return a.joined - b.joined;
	});
}

function join(userId, socketId, game) {
	cache.addMatchmakingEntry(userId, {
		id: userId,
		socketId,
		game,
		joined: new Date()
	});
}

function leave(userId) {
	cache.deleteMatchmakingEntry(userId);
}

function startService(matchFound, interval = 5000) {
	intervalId = setInterval(() => {
		const users = getAvailableUsers();

		//TODO: match the users depending on their prefered game
		//each users has a game property which can be pong or any

		//match the available users
		while (users.length > 1) {
			const matchedUsers = [
				users[0],
				users[1]
			];

			//remove both users from the matchmaking and from the users list
			matchedUsers.forEach((user) => {
				leave(user.id);
				users.shift();
			});

			//TODO: pass the selected game to the matchmaking challenge here ...

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
