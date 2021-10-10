import API from './API';

export default {
	/**
	 * Fetches the config data
	 * @returns {Promise}
	 */
	getConfig() {
		return API.get('/config');
	}
};
