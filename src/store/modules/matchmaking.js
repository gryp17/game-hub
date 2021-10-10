import Vue from 'vue';
import MatchmakingHttpService from '@/services/api/matchmaking';

const getDefaultState = () => {
	return {
		matchmakingEnabled: false,
		matchmakingIsLoading: false
	};
};

const state = getDefaultState();

const mutations = {
	RESET_STATE(state) {
		Object.assign(state, getDefaultState());
	},
	SET_MATCHMAKING_ENABLED(state, status) {
		state.matchmakingEnabled = status;
	},
	SET_MATCHMAKING_IS_LOADING(state, value) {
		state.matchmakingIsLoading = value;
	}
};

const actions = {
	/**
	 * Fetches the user's matchmaking status
	 * @param {Object} context
	 */
	async getMatchmakingStatus(context) {
		try {
			const { data } = await MatchmakingHttpService.getStatus();
			context.commit('SET_MATCHMAKING_ENABLED', data);
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Failed to get the matchmaking status: ${err}`
			});
		}
	},
	/**
	 * Updates the matchmaking status
	 * @param {Object} context
	 * @param {Boolean} status
	 */
	setMatchmakingEnabled(context, status) {
		context.commit('SET_MATCHMAKING_ENABLED', status);
	},
	/**
	 * Starts/joins the matchmaking
	 * @param {Object} context
	 * @param {String} game
	 */
	async startMatchmaking(context, game) {
		context.commit('SET_MATCHMAKING_IS_LOADING', true);

		try {
			const { data } = await MatchmakingHttpService.join(game);

			//throw the errors and show them using a toast instead of handling them in a form or something
			if (data && data.errors) {
				const errors = Object.values(data.errors).join(', ');
				throw new Error(errors);
			}

			context.commit('SET_MATCHMAKING_ENABLED', true);
			context.commit('SET_MATCHMAKING_IS_LOADING', false);
		} catch (err) {
			context.commit('SET_MATCHMAKING_IS_LOADING', false);

			Vue.toasted.global.apiError({
				message: `Failed to join the matchmaking: ${err}`
			});
		}
	},
	/**
	 * Stops/leaves the matchmaking
	 * @param {Object} context
	 */
	async stopMatchmaking(context) {
		context.commit('SET_MATCHMAKING_IS_LOADING', true);

		try {
			await MatchmakingHttpService.leave();
			context.commit('SET_MATCHMAKING_ENABLED', false);
			context.commit('SET_MATCHMAKING_IS_LOADING', false);
		} catch (err) {
			context.commit('SET_MATCHMAKING_IS_LOADING', false);

			Vue.toasted.global.apiError({
				message: `Failed to leave the matchmaking: ${err}`
			});
		}
	},
	/**
	 * Cancels the matchmaking challenge
	 * @param {Object} context
	 */
	async cancelMatchmakingChallenge(context) {
		try {
			await MatchmakingHttpService.cancelChallenge();
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Failed to cancel the matchmaking challenge: ${err}`
			});
		}
	},
	/**
	 * Accepts the matchmaking challenge
	 * @param {Object} context
	 */
	async acceptMatchmakingChallenge(context) {
		try {
			const { data } = await MatchmakingHttpService.acceptChallenge();

			//throw the errors and show them using a toast instead of handling them in a form or something
			if (data && data.errors) {
				const errors = Object.values(data.errors).join(', ');
				throw new Error(errors);
			}
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Failed to accept the matchmaking challenge: ${err}`
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
