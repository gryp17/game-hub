import Vue from 'vue';
import ConfigHttpService from '@/services/api/config';

const getDefaultState = () => {
	return {
		userStatuses: {},
		availableGames: [],
		socketEvents: {},
		configurableSettings: {},
		validInputKeyCodes: {}
	};
};

const state = getDefaultState();

const getters = {
	/**
	 * Contains the list of available games. Uses the gamesMap filter to include the game icon and other data.
	 * @param {Object} state
	 * @returns {Array}
	 */
	availableGames(state) {
		//map the game code to the game label, icon etc.
		return state.availableGames.map((gameCode) => {
			return Vue.options.filters.gamesMap(gameCode);
		});
	}
};

const mutations = {
	RESET_STATE(state) {
		Object.assign(state, getDefaultState());
	},
	SET_USER_STATUSES(state, userStatuses) {
		state.userStatuses = userStatuses;
	},
	SET_AVAILABLE_GAMES(state, availableGames) {
		state.availableGames = availableGames;
	},
	SET_SOCKET_EVENTS(state, socketEvents) {
		state.socketEvents = socketEvents;
	},
	SET_CONFIGURABLE_SETTINGS(state, configurableSettings) {
		state.configurableSettings = configurableSettings;
	},
	SET_VALID_INPUT_KEY_CODES(state, validInputKeyCodes) {
		state.validInputKeyCodes = validInputKeyCodes;
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
	 * Fetches the application config
	 * @param {Object} context
	 * @returns {Promise}
	 */
	async getConfig(context) {
		try {
			const { data } = await ConfigHttpService.getConfig();
			context.commit('SET_USER_STATUSES', data.userStatuses);
			context.commit('SET_AVAILABLE_GAMES', data.availableGames);
			context.commit('SET_SOCKET_EVENTS', data.socketEvents);
			context.commit('SET_CONFIGURABLE_SETTINGS', data.configurableSettings);
			context.commit('SET_VALID_INPUT_KEY_CODES', data.validInputKeyCodes);
			return data;
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Get config failed: ${err}`
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
