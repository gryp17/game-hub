<template>
	<div
		v-if="userSession"
		class="lobby-page"
	>
		<LoadingIndicator
			v-if="loading"
			full-screen
		/>
		<template v-else>
			<div class="page-header">
				<div class="column">
					<PlayButton
						:active="matchmakingEnabled"
						:disabled="matchmakingIsLoading"
						:available-games="availableGames"
						@play="onStartMatchmaking"
						@stop="onStopMatchmaking"
					/>
				</div>
				<div class="column">
					<img
						alt="logo"
						class="logo"
						title="GameHub"
						src="@/assets/img/logo-white.png"
					/>
					<img
						alt="logo"
						class="logo small"
						title="GameHub"
						src="@/assets/img/logo-small.png"
					/>
				</div>
				<div class="column">
					<UserMenu
						@logout="logout"
						@edit-profile="showEditProfileModal"
					/>
				</div>
			</div>
			<div class="content-wrapper">
				<ToggleChatButton
					:active="showChat"
					@toggle="onChatToggled"
				/>

				<Chat :style="chatStyles.chat" />

				<UsersList
					:style="chatStyles.usersList"
					:users="lobbyUsers"
					:user-statuses="userStatuses"
					@open-profile="showProfileModal"
				/>
			</div>
		</template>

		<ChallengeModal
			@accept="onChallengeAccepted"
			@decline="onChallengeDeclined"
		/>
		<ChallengeSettingsModal
			@challenge="onChallengePlayer"
			@cancel="onChallengeCanceled"
		/>
		<MatchmakingPendingModal
			@accept="onMatchmakingChallengeAccepted"
			@cancel="onMatchmakingChallengeCanceled"
		/>

		<UserProfileModal />

		<EditProfileModal />
	</div>
</template>

<script>
	import SocketIO from 'socket.io-client';
	import { mapState, mapGetters, mapActions } from 'vuex';
	import {
		showProfileModal,
		showEditProfileModal,
		showChallengeModal,
		showMatchmakingPendingModal,
		hideChallengeModal,
		hideChallengeSettingsModal,
		hideMatchmakingPendingModal
	} from '@/services/modal';
	import config from '@/config';
	import LoadingIndicator from '@/components/LoadingIndicator';
	import UsersList from '@/components/users-list/UsersList';
	import Chat from '@/components/chat/Chat';
	import PlayButton from '@/components/PlayButton';
	import UserMenu from '@/components/UserMenu';
	import ToggleChatButton from '@/components/ToggleChatButton';
	import ChallengeModal from '@/components/modals/ChallengeModal';
	import ChallengeSettingsModal from '@/components/modals/ChallengeSettingsModal';
	import MatchmakingPendingModal from '@/components/modals/MatchmakingPendingModal';
	import UserProfileModal from '@/components/modals/user-profile/UserProfileModal';
	import EditProfileModal from '@/components/modals/EditProfileModal';

	export default {
		components: {
			LoadingIndicator,
			UsersList,
			Chat,
			PlayButton,
			ToggleChatButton,
			ChallengeModal,
			ChallengeSettingsModal,
			MatchmakingPendingModal,
			UserProfileModal,
			EditProfileModal,
			UserMenu
		},
		data() {
			return {
				loading: true,
				socket: null,
				showChat: false
			};
		},
		computed: {
			...mapState('auth', [
				'userSession'
			]),
			...mapState('config', [
				'userStatuses',
				'socketEvents'
			]),
			...mapState('matchmaking', [
				'matchmakingEnabled',
				'matchmakingIsLoading'
			]),
			...mapGetters('lobby', [
				'lobbyUsers'
			]),
			...mapGetters('config', [
				'availableGames'
			]),
			/**
			 * Returns the chat/users list styles. This is used to toggle between the 2 components in low resolutions.
			 * @returns {Object}
			 */
			chatStyles() {
				return {
					chat: {
						zIndex: this.showChat ? 1 : null
					},
					usersList: {
						zIndex: !this.showChat ? 1 : null
					}
				};
			}
		},
		/**
		 * Fetches all necessary data from the backend before showing the lobby
		 */
		async created() {
			await Promise.all([
				this.getUsers(),
				this.getMatchmakingStatus()
			]);

			this.getMessages({
				limit: 30,
				offset: 0
			});

			this.connectToSocket();
			this.loading = false;
		},
		/**
		 * Disconnects from the socket
		 */
		beforeDestroy() {
			this.disconnectFromSocket();
		},
		methods: {
			...mapActions('auth', [
				'logout'
			]),
			...mapActions('lobby', [
				'getUsers',
				'newUserReceived',
				'updateUser',
				'updateUserStatuses',
				'challengePlayer',
				'cancelChallenge',
				'declineChallenge',
				'acceptChallenge'
			]),
			...mapActions('chat', [
				'getMessages',
				'messageReceived'
			]),
			...mapActions('matchmaking', [
				'getMatchmakingStatus',
				'startMatchmaking',
				'stopMatchmaking',
				'setMatchmakingEnabled',
				'cancelMatchmakingChallenge',
				'acceptMatchmakingChallenge'
			]),
			...mapActions('audio', [
				'playTrack'
			]),
			/**
			 * Shows the edit profile modal
			 */
			showEditProfileModal() {
				showEditProfileModal();
			},
			/**
			 * Shows the profile modal
			 */
			showProfileModal(user) {
				showProfileModal(user.id);
			},
			/**
			 * Sends a player challenge
			 * @param {Object} data
			 * @returns {Promise}
			 */
			async onChallengePlayer({ user, game, settings }) {
				return this.challengePlayer({
					userId: user.id,
					game,
					settings
				});
			},
			/**
			 * Connects to the socket.io server and listens for it's events
			 */
			connectToSocket() {
				//initialize the socket connection
				this.socket = SocketIO(config.socketLobbyNamespace, {
					transports: ['websocket'],
					upgrade: false
				});

				this.socket.on(this.socketEvents.error, (error) => {
					this.$toasted.global.apiError({
						message: this.$options.filters.errorsMap(error)
					});
				});

				this.socket.on(this.socketEvents.lobby.newUser, (user) => {
					this.newUserReceived(user);
				});

				this.socket.on(this.socketEvents.lobby.updateUser, (user) => {
					this.updateUser(user);
				});

				this.socket.on(this.socketEvents.lobby.updateUserStatuses, (statuses) => {
					this.updateUserStatuses(statuses);
				});

				this.socket.on(this.socketEvents.lobby.challenge, ({ user, game, settings }) => {
					this.playTrack('challenge');

					showChallengeModal({
						user,
						game,
						settings
					});
				});

				this.socket.on(this.socketEvents.lobby.cancelChallenge, () => {
					hideChallengeModal();
				});

				this.socket.on(this.socketEvents.lobby.declineChallenge, () => {
					hideChallengeSettingsModal();
				});

				this.socket.on(this.socketEvents.lobby.foundMatch, (game) => {
					this.playTrack('challenge');

					// automatically stop the matchmaking when a new match arrives
					this.setMatchmakingEnabled(false);

					showMatchmakingPendingModal({
						game
					});
				});

				this.socket.on(this.socketEvents.lobby.cancelMatchmakingChallenge, () => {
					hideMatchmakingPendingModal();
				});

				this.socket.on(this.socketEvents.lobby.goToGame, (game) => {
					this.$router.push({
						name: 'play',
						params: {
							game
						}
					});
				});

				this.socket.on(this.socketEvents.lobby.newMessage, (message) => {
					this.messageReceived(message);
				});
			},
			/**
			 * Disconnects from the socket.io server
			 */
			disconnectFromSocket() {
				if (this.socket) {
					this.socket.disconnect();
				}
			},
			/**
			 * Accepts a player challenge
			 * @param {Object} user
			 */
			onChallengeAccepted(user) {
				this.acceptChallenge(user.id);
			},
			/**
			 * Declines a player challenge
			 * @param {Object} user
			 */
			onChallengeDeclined(user) {
				this.declineChallenge(user.id);
			},
			/**
			 * Cancels a player challenge
			 * @param {Object} user
			 */
			onChallengeCanceled(user) {
				this.cancelChallenge(user.id);
			},
			/**
			 * Accepts a matchmaking challenge
			 */
			onMatchmakingChallengeAccepted() {
				this.acceptMatchmakingChallenge();
			},
			/**
			 * Cancels a matchmaking challenge
			 */
			onMatchmakingChallengeCanceled() {
				this.cancelMatchmakingChallenge();
			},
			/**
			 * Starts/joins the matchmaking
			 * @param {String} game
			 */
			onStartMatchmaking(game) {
				this.startMatchmaking(game);
			},
			/**
			 * Stops/leaves the matchmaking
			 */
			onStopMatchmaking() {
				this.stopMatchmaking();
			},
			/**
			 * Toggles the chat and users list
			 */
			onChatToggled(status) {
				this.showChat = status;
			}
		}
	};
</script>

<style lang="scss">
	$header-height: 72px;

	.lobby-page {
		height: 100%;

		.page-header {
			display: flex;
			height: $header-height;
			padding: 15px;
			background-color: $gray-darkest;

			.column {
				flex: 1;
			}

			.logo {
				display: block;
				margin: auto;
				margin-top: -2px;
				width: 135px;

				&.small {
					display: none;
					margin-top: 3px;
					width: 82px;
				}
			}

			.user-menu {
				float: right;
			}
		}

		.content-wrapper {
			position: relative;
			display: flex;
			flex: 1;
			height: calc(100% - #{$header-height});

			.toggle-chat-button {
				display: none;
			}

			.chat {
				flex: 1;
			}
		}

		@media (max-width: $small) {
			.content-wrapper {
				flex-direction: column;

				.toggle-chat-button {
					display: block;
				}

				.chat, .users-list {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
				}
			}
		}

		@media (max-width: $extra-small) {
			.page-header {
				.logo {
					display: none;

					&.small {
						display: block;
					}
				}
			}
		}
	}
</style>
