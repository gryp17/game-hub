let app;

const modals = {
	profile: 'user-profile-modal',
	editProfile: 'edit-profile-modal',
	challenge: 'challenge-modal',
	challengeSettings: 'challenge-settings-modal',
	matchmakingPending: 'matchmaking-pending-modal',
	gameOver: 'game-over-modal'
};

/**
 * Sets the app instance
 * @param {Object} appInstance
 */
function initModals(appInstance) {
	app = appInstance;
}

/**
 * Shows a modal by id
 * @param {String} id
 * @param {Object} params
 */
function showModal(id, params) {
	app.$modal.show(id, params);
}

/**
 * Hides a modal by id
 * @param {String} id
 */
function hideModal(id) {
	app.$modal.hide(id);
}

/**
 * Shows the user profile modal
 * @param {Object} params
 */
function showProfileModal(params) {
	showModal(modals.profile, params);
}

/**
 * Hides the user profile modal
 */
function hideProfileModal() {
	hideModal(modals.profile);
}

/**
 * Shows the edit profile modal
 * @param {Object} params
 */
function showEditProfileModal(params) {
	showModal(modals.editProfile, params);
}

/**
 * Hides the edit profile modal
 */
function hideEditProfileModal() {
	hideModal(modals.editProfile);
}

/**
 * Shows the challenge modal
 * @param {Object} params
 */
function showChallengeModal(params) {
	showModal(modals.challenge, params);
}

/**
 * Hides the challenge modal
 */
function hideChallengeModal() {
	hideModal(modals.challenge);
}

/**
 * Shows the challenge settings modal
 * @param {Object} params
 */
function showChallengeSettingsModal(params) {
	showModal(modals.challengeSettings, params);
}

/**
 * Hides the challenge settings modal
 */
function hideChallengeSettingsModal() {
	hideModal(modals.challengeSettings);
}

/**
 * Shows the matchmaking pending modal
 * @param {Object} params
 */
function showMatchmakingPendingModal(params) {
	showModal(modals.matchmakingPending, params);
}

/**
 * Hides the matchmaking pending modal
 */
function hideMatchmakingPendingModal() {
	hideModal(modals.matchmakingPending);
}

/**
 * Shows the game over modal
 * @param {Object} params
 */
function showGameOverModal(params) {
	showModal(modals.gameOver, params);
}

/**
 * Hides the game over modal
 */
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
