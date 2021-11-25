import API from './API';

export default {
	/**
	 * Fetches the settings data
	 * @returns {Promise}
	 */
	getSettings() {
		return API.get('/settings');
	},
	/**
	 * Updates the user's game settings
	 * @param {Object} settings
	 * @returns {Promise}
	 */
	updateSettings(settings) {
		return API.put('/settings', settings);
	}
};
