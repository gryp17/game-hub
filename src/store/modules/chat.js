const getDefaultState = () => {
	return {
		messages: []
	};
};

const state = getDefaultState();

const getters = {
	messages(state) {
		return state.messages;
	}
};

const mutations = {
	RESET_STATE(state) {
		Object.assign(state, getDefaultState());
	},
	SET_MESSAGES(state, messages) {
		state.messages = messages;
	}
};

const actions = {

};

export default {
	namespaced: true,
	getters,
	state,
	mutations,
	actions
};
