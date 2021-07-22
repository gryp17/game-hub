import API from './API';

export default {
	/**
	 * Fetches the game history
	 * @param {Number} userId
	 * @param {Number} limit
	 * @param {Number} offset
	 * @returns {Promise}
	 */
	getHistory(userId, limit, offset) {
		return API.get(`/game/history/${userId}/?limit=${limit}&offset=${offset}`);
	}
};
