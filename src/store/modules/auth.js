import Vue from 'vue';
import UserHttpService from '@/services/api/user';

const getDefaultState = () => {
	return {
		userSession: null
	};
};

const state = getDefaultState();

const getters = {
	/**
	 * Returns the user session
	 * Also adds the user status using the usersMap
	 * @param {Object} state
	 * @param {Object} getters
	 * @param {Object} rootState
	 * @param {Object} rootGetters
	 * @returns {Object}
	 */
	userSession(state, getters, rootState, rootGetters) {
		if (!state.userSession) {
			return null;
		}

		const userStatuses = rootState.config.userStatuses;
		const usersMap = rootGetters['lobby/usersMap'];

		//get the current user status from the users map
		const user = usersMap[state.userSession.id];

		return {
			...state.userSession,
			status: user ? user.status : userStatuses.offline
		};
	},
	/**
	 * Indicates whetner the user is authenticated
	 * @param {Object} state
	 * @returns {Boolean}
	 */
	isLoggedIn(state) {
		return !!state.userSession;
	}
};

const mutations = {
	RESET_STATE(state) {
		Object.assign(state, getDefaultState());
	},
	SET_USER_SESSION(state, userSession) {
		state.userSession = userSession;
	}
};

const actions = {
	/**
	 * Resets the module state
	 * @param {Object} context
	 */
	resetState(context) {
		context.commit('RESET_STATE');
	},
	/**
	 * Returns the current user session
	 * @param {Object} context
	 * @returns {Promise}
	 */
	async getUserSession(context) {
		try {
			const { data } = await UserHttpService.getSession();
			const user = data && data.user ? data.user : null;
			context.commit('SET_USER_SESSION', user);

			return data;
		} catch (err) {
			context.commit('SET_USER_SESSION', null);
			return false;
		}
	},
	/**
	 * Logs in the user
	 * @param {Object} context
	 * @param {Object} data
	 * @returns {Promise}
	 */
	async login(context, { email, password }) {
		try {
			const { data } = await UserHttpService.login(email, password);
			if (data && data.user) {
				context.commit('SET_USER_SESSION', data.user);
			}
			return data;
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Login failed: ${err}`
			});
		}
	},
	/**
	 * Signs up the user
	 * @param {Object} context
	 * @param {Object} data
	 * @returns {Promise}
	 */
	async signup(context, { email, username, password, repeatPassword }) {
		try {
			const { data } = await UserHttpService.signup(email, username, password, repeatPassword);
			if (data && data.user) {
				context.commit('SET_USER_SESSION', data.user);
			}
			return data;
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Signup failed: ${err}`
			});
		}
	},
	/**
	 * Updates the user data
	 * @param {Object} context
	 * @param {Object} formData
	 * @returns {Promise}
	 */
	async updateUser(context, formData) {
		try {
			const { data } = await UserHttpService.updateUser(formData);
			context.commit('SET_USER_SESSION', data);
			return data;
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Update user failed: ${err}`
			});
		}
	},
	/**
	 * Logs out the user
	 * @param {Object} context
	 */
	async logout(context) {
		try {
			await UserHttpService.logout();
			context.commit('SET_USER_SESSION', null);
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Logout failed: ${err}`
			});
		}
	}
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
};
