let app;

const modals = {
	profile: 'user-profile-modal',
	editProfile: 'edit-profile-modal',
	challenge: 'challenge-modal',
	challengeSettings: 'challenge-settings-modal',
	matchmakingPending: 'matchmaking-pending-modal',
	gameOver: 'game-over-modal'
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

function showChallengeSettingsModal(params) {
	showModal(modals.challengeSettings, params);
}

function hideChallengeSettingsModal() {
	hideModal(modals.challengeSettings);
}

function showMatchmakingPendingModal(params) {
	showModal(modals.matchmakingPending, params);
}

function hideMatchmakingPendingModal() {
	hideModal(modals.matchmakingPending);
}

function showGameOverModal(params) {
	showModal(modals.gameOver, params);
}

function hideGameOverModal() {
	hideModal(modals.gameOver);
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
	showChallengeSettingsModal,
	hideChallengeSettingsModal,
	showMatchmakingPendingModal,
	hideMatchmakingPendingModal,
	showGameOverModal,
	hideGameOverModal
};
