import _ from 'lodash';
import cache from './cache';
import { availableGames } from '../config';

let intervalId = null;

function getAvailablePlayers() {
	const players = Object.values(cache.getMatchmakingEntries());

	return players.sort((a, b) => {
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

function findOpponentIndex(game, players) {
	return players.findIndex((opponent) => {
		return game === 'any' || opponent.game === 'any' || opponent.game === game;
	});
}

function pickGame(playerGame, opponentGame) {
	const games = Object.values(availableGames);

	if (playerGame !== 'any') {
		return playerGame;
	}

	if (opponentGame !== 'any') {
		return opponentGame;
	}

	//pick a random game
	return _.sample(games);
}

function matchPlayers(matchFound) {
	const players = getAvailablePlayers();

	//match the available players
	while (players.length > 1) {
		const player = players[0];
		players.shift();

		//find the first compatible opponent
		const opponentIndex = findOpponentIndex(player.game, players);

		if (opponentIndex === -1) {
			continue;
		}

		//and remove him from the list
		const opponent = players[opponentIndex];
		players.splice(opponentIndex, 1);

		//pick a game that works for both players
		const selectedGame = pickGame(player.game, opponent.game);

		//remove both players from the matchmaking
		[player, opponent].forEach((player) => {
			leave(player.id);
		});

		//add the cache entry for this match/challenge
		cache.addMatchmakingChallenge(player, opponent, selectedGame);

		//notify the socket server or whatever about this match
		matchFound(player, opponent, selectedGame);
	}
}

function startService(matchFound, interval = 5000) {
	intervalId = setInterval(() => {
		matchPlayers(matchFound);
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
