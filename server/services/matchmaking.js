import _ from 'lodash';
import cache from './cache';
import { gameCodes } from '../config';

let intervalId = null;

/**
 * Returns all available players ordered by joined date
 * @returns {Array}
 */
function getAvailablePlayers() {
	const players = Object.values(cache.getMatchmakingEntries());

	return players.sort((a, b) => {
		return a.joined - b.joined;
	});
}

/**
 * Joins the matchmaking
 * @param {Number} userId
 * @param {Number} socketId
 * @param {Number} experience
 * @param {String} game
 */
function join(userId, socketId, experience, game) {
	cache.addMatchmakingEntry(userId, {
		id: userId,
		socketId,
		experience,
		game,
		joined: new Date()
	});
}

/**
 * Leaves the matchmaking
 * @param {Number} userId
 */
function leave(userId) {
	cache.deleteMatchmakingEntry(userId);
}

/**
 * Finds the first compatible opponent
 * @param {String} game
 * @param {Number} experience
 * @param {Array} players
 * @returns {Object}
 */
function findOpponent(game, experience, players) {
	//filter the players by game
	//calculate the experience difference between the current player and the possible opponents
	//sort them by experienceDifference
	const validOpponents = [...players].filter((opponent) => {
		return game === 'any' || opponent.game === 'any' || opponent.game === game;
	}).map((opponent) => {
		opponent.experienceDifference = Math.abs(experience - opponent.experience);
		return opponent;
	}).sort((a, b) => {
		return a.experienceDifference - b.experienceDifference;
	});

	if (validOpponents.length === 0) {
		return null;
	}

	return validOpponents[0];
}

/**
 * Picks a game that works for both users
 * @param {String} playerGame
 * @param {String} opponentGame
 * @returns {String}
 */
function pickGame(playerGame, opponentGame) {
	if (playerGame !== 'any') {
		return playerGame;
	}

	if (opponentGame !== 'any') {
		return opponentGame;
	}

	//pick a random game
	return _.sample(gameCodes);
}

/**
 * Loops through the available players and matches them with each other by checking their game preferences and experience levels
 * @param {Function} matchFound
 */
function matchPlayers(matchFound) {
	let players = getAvailablePlayers();

	//match the available players
	while (players.length > 1) {
		const player = players[0];
		players.shift();

		//find the first compatible opponent
		const opponent = findOpponent(player.game, player.experience, players);

		if (!opponent) {
			continue;
		}

		//remove the opponent from the players queue
		players = players.filter((user) => {
			return user.id !== opponent.id;
		});

		//pick a game that works for both players
		const selectedGame = pickGame(player.game, opponent.game);

		//remove both players from the matchmaking
		[player, opponent].forEach((user) => {
			leave(user.id);
		});

		//add the cache entry for this match/challenge
		cache.addMatchmakingChallenge(player, opponent, selectedGame);

		//notify the socket server or whatever about this match
		matchFound(player, opponent, selectedGame);
	}
}

/**
 * Starts the matchmaking service
 * @param {Function} matchFound
 * @param {Number} interval
 */
function startService(matchFound, interval = 5000) {
	intervalId = setInterval(() => {
		matchPlayers(matchFound);
	}, interval);
}

/**
 * Stops the matchmaking service
 */
function stopService() {
	clearInterval(intervalId);
}

/**
 * Indicates whether the user has joined the matchmaking
 * @param {Number} userId
 * @returns {Boolean}
 */
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
