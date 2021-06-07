import errorCodes from './constants/error-codes';
import userStatuses from './constants/user-statuses';

//get the environment
const environment = process.env.NODE_ENV || 'development';

//get config from the environment
const config = require(`./${environment}`);
config.errorCodes = errorCodes;
config.userStatuses = userStatuses;

module.exports = config;
