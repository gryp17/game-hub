import API from './API';

export default {
	/**
	 * Fetches the settings data
	 * @returns {Promise}
	 */
	getSettings() {
		return API.get('/settings');
	}
};
