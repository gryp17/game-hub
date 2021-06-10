import Vue from 'vue';

const getDefaultState = () => {
	return {
		errors: {
			login: {},
			signup: {},
			editProfile: {}
		}
	};
};

const state = getDefaultState();

const mutations = {
	RESET_STATE(state) {
		Object.assign(state, getDefaultState());
	},
	SET_FORM_ERROR(state, { form, field, error }) {
		Vue.set(state.errors[form], field, error);
	},
	SET_FORM_ERRORS(state, { form, errors }) {
		Vue.set(state.errors, form, errors);
	},
	RESET_FORM_ERRORS(state, form) {
		Vue.set(state.errors, form, {});
	}
};

const actions = {
	/**
	 * Clears a single form error
	 * @param {Object} context
	 * @param {Object} data
	 */
	clearFormError(context, { form, field }) {
		context.commit('SET_FORM_ERROR', {
			form,
			field,
			error: null
		});
	},
	/**
	 * Sets the form errors
	 * @param {Object} context
	 * @param {Object} data
	 */
	setFormErrors(context, { form, errors }) {
		context.commit('SET_FORM_ERRORS', {
			form,
			errors
		});
	},
	/**
	 * Resets all form errors
	 * @param {Object} context
	 * @param {Object} form
	 */
	resetFormErrors(context, form) {
		context.commit('RESET_FORM_ERRORS', form);
	}
};

export default {
	namespaced: true,
	state,
	mutations,
	actions
};
