import API from './API';

export default {
	/**
	 * Sends a new message
	 * @param {String} content
	 * @returns {Promise}
	 */
	sendMessage(content) {
		return API.post('/message', {
			content
		});
	},
	/**
	 * Gets all messages
	 * @param {Number} limit
	 * @param {Number} offset
	 * @returns {Promise}
	 */
	getMessages(limit, offset) {
		return API.get(`/message?limit=${limit}&offset=${offset}`);
	}
};
