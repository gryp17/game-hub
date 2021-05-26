import API from './API';

export default {
	/**
	 * Logs in the user with the provided credentials
	 * @param {String} email
	 * @param {String} password
	 * @returns {Promise}
	 */
	login(email, password) {
		return API.post('/auth/login', {
			email,
			password
		});
	},
	/**
	 * Logs out the user
	 * @returns {Promise}
	 */
	logout() {
		return API.get('/auth/logout');
	},
	/**
	 * Signs up the user
	 * @param {String} email
	 * @param {String} username
	 * @param {String} password
	 * @param {String} repeatPassword
	 * @returns {Promise}
	 */
	signup(email, username, password, repeatPassword) {
		return API.post('/auth/signup', {
			email,
			username,
			password,
			repeatPassword
		});
	},
	/**
	 * Returns the current user session
	 * @returns {Promise}
	 */
	getSession() {
		return API.get('/auth/session');
	},
	/**
	 * Updates the user profile
	 * @param {Object} data
	 * @returns {Promise}
	 */
	updateUser(data) {
		return API.put('/user', data);
	}
};
