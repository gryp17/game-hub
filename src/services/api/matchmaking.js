import API from './API';

export default {
	/**
	 * Fetches the matchmaking status
	 * @returns {Promise}
	 */
	getStatus() {
		return API.get('/matchmaking/status');
	},
	/**
	 * Joins the matchmaking
	 * @param {String} game
	 * @returns {Promise}
	 */
	join(game) {
		return API.post('/matchmaking/join', {
			game
		});
	},
	/**
	 * Leaves the matchmaking
	 * @returns {Promise}
	 */
	leave() {
		return API.post('/matchmaking/leave');
	},
	/**
	 * Cancels the matchmaking challenge
	 * @returns {Promise}
	 */
	cancelChallenge() {
		return API.delete('/matchmaking/challenge');
	},
	/**
	 * Accepts the matcmaking challenge
	 * @returns {Promise}
	 */
	acceptChallenge() {
		return API.post('/matchmaking/challenge/accept');
	}
};
