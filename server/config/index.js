import errorCodes from './constants/error-codes';
import userStatuses from './constants/user-statuses';
import gameStatuses from './constants/game-statuses';
import games from './constants/games';
import experienceRewards from './constants/experience-rewards';
import socketEvents from './constants/socket-events';

//get the environment
const environment = process.env.NODE_ENV || 'development';

//get config from the environment
const config = require(`./${environment}`);

//create a separate entry with just the game codes
const gameCodes = Object.values(games).map((game) => {
	return game.code;
});

module.exports = {
	...config,
	errorCodes,
	userStatuses,
	gameStatuses,
	games,
	gameCodes,
	experienceRewards,
	socketEvents
};
