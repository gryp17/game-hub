import Vue from 'vue';
import ConfigHttpService from '@/services/config';

const getDefaultState = () => {
	return {
		userStatuses: {},
		availableGames: {}
	};
};

const state = getDefaultState();

const mutations = {
	RESET_STATE(state) {
		Object.assign(state, getDefaultState());
	},
	SET_USER_STATUSES(state, userStatuses) {
		state.userStatuses = userStatuses;
	},
	SET_AVAILABLE_GAMES(state, availableGames) {
		state.availableGames = availableGames;
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
	async getConfig(context) {
		try {
			const { data } = await ConfigHttpService.getConfig();
			context.commit('SET_USER_STATUSES', data.userStatuses);
			context.commit('SET_AVAILABLE_GAMES', data.availableGames);
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
	mutations,
	actions
};
