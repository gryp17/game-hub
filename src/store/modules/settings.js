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
	},
	/**
	 * Updates the user's game settings
	 * @param {Object} context
	 * @param {Object} settings
	 * @returns {Promise}
	 */
	async updateSettings(context, settings) {
		//if the sound or music values weren't provided use their current values
		const params = {
			sound: context.state.sound,
			music: context.state.music,
			...settings
		};

		try {
			const { data } = await SettingsHttpService.updateSettings(params);

			//throw the errors and show them using a toast instead of handling them in a form or something
			if (data && data.errors) {
				const errors = Object.values(data.errors).join(', ');
				throw new Error(errors);
			}

			context.commit('SET_CONTROLS', data.controls);
			context.commit('SET_SOUND', data.sound);
			context.commit('SET_MUSIC', data.music);

			return data;
		} catch (err) {
			Vue.toasted.global.apiError({
				message: `Update settings failed: ${err}`
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
