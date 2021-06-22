let app;

const modals = {
	profile: 'user-profile-modal',
	editProfile: 'edit-profile-modal',
	challenge: 'challenge-modal',
	challengePending: 'challenge-pending-modal',
	matchmakingPending: 'matchmaking-pending-modal'
};

function initModals(appInstance) {
	app = appInstance;
}

function showModal(id, params) {
	app.$modal.show(id, params);
}

function hideModal(id) {
	app.$modal.hide(id);
}

function showProfileModal(params) {
	showModal(modals.profile, params);
}

function hideProfileModal() {
	hideModal(modals.profile);
}

function showEditProfileModal(params) {
	showModal(modals.editProfile, params);
}

function hideEditProfileModal() {
	hideModal(modals.editProfile);
}

function showChallengeModal(params) {
	showModal(modals.challenge, params);
}

function hideChallengeModal() {
	hideModal(modals.challenge);
}

function showChallengePendingModal(params) {
	showModal(modals.challengePending, params);
}

function hideChallengePendingModal() {
	hideModal(modals.challengePending);
}

function showMatchmakingPendingModal(params) {
	showModal(modals.matchmakingPending, params);
}

function hideMatchmakingPendingModal() {
	hideModal(modals.matchmakingPending);
}

export {
	initModals,
	showModal,
	showProfileModal,
	hideProfileModal,
	showEditProfileModal,
	hideEditProfileModal,
	showChallengeModal,
	hideChallengeModal,
	showChallengePendingModal,
	hideChallengePendingModal,
	showMatchmakingPendingModal,
	hideMatchmakingPendingModal
};
