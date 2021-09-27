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
		<ChallengePendingModal
			@cancel="onChallengeCanceled"
		/>
		<MatchmakingPendingModal
			@accept="onMatchmakingChallengeAccepted"
			@cancel="onMatchmakingChallengeCanceled"
		/>

		<UserProfileModal
			@challenge="onChallengePlayer"
		/>

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
		showChallengePendingModal,
		showMatchmakingPendingModal,
		hideChallengeModal,
		hideChallengePendingModal,
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
	import ChallengePendingModal from '@/components/modals/ChallengePendingModal';
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
			ChallengePendingModal,
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
			showEditProfileModal() {
				showEditProfileModal();
			},
			showProfileModal(user) {
				showProfileModal(user.id);
			},
			async onChallengePlayer({ user, game }) {
				const success = await this.challengePlayer({
					userId: user.id,
					game
				});

				if (success) {
					showChallengePendingModal({
						game,
						user
					});
				}
			},
			/**
			 * Connects to the socket.io server and listens for it's events
			 */
			connectToSocket() {
				//initialize the socket connection
				this.socket = SocketIO(`${config.socketUrl}/lobby`, {
					transports: ['websocket'],
					upgrade: false
				});

				this.socket.on(this.socketEvents.ERROR, (error) => {
					this.$toasted.global.apiError({
						message: this.$options.filters.errorsMap(error)
					});
				});

				this.socket.on(this.socketEvents.LOBBY.NEW_USER, (user) => {
					this.newUserReceived(user);
				});

				this.socket.on(this.socketEvents.LOBBY.UPDATE_USER, (user) => {
					this.updateUser(user);
				});

				this.socket.on(this.socketEvents.LOBBY.UPDATE_USER_STATUSES, (statuses) => {
					this.updateUserStatuses(statuses);
				});

				this.socket.on(this.socketEvents.LOBBY.CHALLENGE, ({ user, game }) => {
					showChallengeModal({
						game,
						user
					});
				});

				this.socket.on(this.socketEvents.LOBBY.CANCEL_CHALLENGE, () => {
					hideChallengeModal();
				});

				this.socket.on(this.socketEvents.LOBBY.DECLINE_CHALLENGE, () => {
					hideChallengePendingModal();
				});

				this.socket.on(this.socketEvents.LOBBY.FOUND_MATCH, (game) => {
					// automatically stop the matchmaking when a new match arrives
					this.setMatchmakingEnabled(false);

					showMatchmakingPendingModal({
						game
					});
				});

				this.socket.on(this.socketEvents.LOBBY.CANCEL_MATCHMAKING_CHALLENGE, () => {
					hideMatchmakingPendingModal();
				});

				this.socket.on(this.socketEvents.LOBBY.GO_TO_GAME, (game) => {
					this.$router.push({
						name: game
					});
				});

				this.socket.on(this.socketEvents.LOBBY.NEW_MESSAGE, (message) => {
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
			onChallengeAccepted(user) {
				this.acceptChallenge(user.id);
			},
			onChallengeDeclined(user) {
				this.declineChallenge(user.id);
			},
			onChallengeCanceled(user) {
				this.cancelChallenge(user.id);
			},
			onMatchmakingChallengeAccepted() {
				this.acceptMatchmakingChallenge();
			},
			onMatchmakingChallengeCanceled() {
				this.cancelMatchmakingChallenge();
			},
			onStartMatchmaking(game) {
				this.startMatchmaking(game);
			},
			onStopMatchmaking() {
				this.stopMatchmaking();
			},
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
