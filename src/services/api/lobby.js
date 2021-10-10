import API from './API';

export default {
	/**
	 * Challenges the user
	 * @param {Number} userId
	 * @param {String} game
	 * @param {Object} settings
	 * @returns {Promise}
	 */
	challengePlayer(userId, game, settings) {
		return API.post('/lobby/challenge', {
			userId,
			game,
			settings
		});
	},
	/**
	 * Cancels the player challenge
	 * @param {Number} userId
	 * @returns {Promise}
	 */
	cancelChallenge(userId) {
		return API.delete('/lobby/challenge', {
			data: {
				userId
			}
		});
	},
	/**
	 * Declines the player challenge
	 * @param {Number} userId
	 * @returns {Promise}
	 */
	declineChallenge(userId) {
		return API.post('/lobby/challenge/decline', {
			userId
		});
	},
	/**
	 * Accepts the player challenge
	 * @param {Number} userId
	 * @returns {Promise}
	 */
	acceptChallenge(userId) {
		return API.post('/lobby/challenge/accept', {
			userId
		});
	}
};
