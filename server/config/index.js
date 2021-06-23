import errorCodes from './constants/error-codes';
import userStatuses from './constants/user-statuses';
import gameStatuses from './constants/game-statuses';
import availableGames from './constants/available-games';

//get the environment
const environment = process.env.NODE_ENV || 'development';

//get config from the environment
const config = require(`./${environment}`);

module.exports = {
	...config,
	errorCodes,
	userStatuses,
	gameStatuses,
	availableGames
};
