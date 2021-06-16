import _ from 'lodash';
import cache from './cache';
import { availableGames } from '../config';

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

function pickGame(userGame, opponentGame) {
	const games = Object.values(availableGames);

	if (userGame !== 'any') {
		return userGame;
	}

	if (opponentGame !== 'any') {
		return opponentGame;
	}

	//pick a random game
	return _.sample(games);
}

function startService(matchFound, interval = 5000) {
	intervalId = setInterval(() => {
		let users = getAvailableUsers();

		//match the available users
		while (users.length > 1) {
			const user = users[0];
			let opponent;
			let selectedGame;

			users.shift();

			//find the first compatible opponent and remove him from the users list
			users = users.filter((entry) => {
				if (!opponent && (user.game === 'any' || entry.game === 'any' || entry.game === user.game)) {
					opponent = entry;
					//pick a game that matches both of the users preferences
					selectedGame = pickGame(user.game, entry.game);
					return false;
				}

				return true;
			});

			if (!opponent) {
				continue;
			}

			//remove both users from the matchmaking
			[user, opponent].forEach((player) => {
				leave(player.id);
			});

			//add the cache entry for this match/challenge
			cache.addMatchmakingChallenge(user, opponent, selectedGame);

			//notify the socket server or whatever about this match
			matchFound(user, opponent, selectedGame);
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
