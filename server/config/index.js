//get the environment
const environment = process.env.NODE_ENV || 'development';

//get config from the environment
const config = require(`./${environment}`);

//create a separate entry with just the game codes
const gameCodes = Object.values(config.games).map((game) => {
	return game.code;
});

module.exports = {
	...config,
	gameCodes
};
