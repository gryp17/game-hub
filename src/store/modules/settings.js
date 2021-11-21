import Vue from 'vue';
import SettingsHttpService from '@/services/api/settings';

const getDefaultState = () => {
	return {
		controls: {},
		sound: false,
		music: false
	};
};

const state = getDefaultState();

const getters = {};

const mutations = {
	RESET_STATE(state) {
		Object.assign(state, getDefaultState());
	},
	SET_CONTROLS(state, controls) {
		state.controls = controls;
	},
	SET_SOUND(state, sound) {
		state.sound = sound;
	},
	SET_MUSIC(state, music) {
		state.music = music;
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
	 * Fetches the user's game settings
	 * @param {Object} context
	 * @returns {Promise}
	 */
	async getSettings(context) {
		try {
			const { data } = await SettingsHttpService.getSettings();
			context.commit('SET_CONTROLS', data.controls);
			context.commit('SET_SOUND', data.sound);
			context.commit('SET_MUSIC', data.music);
			return data;
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Get settings failed: ${err}`
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
