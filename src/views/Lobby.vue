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
				</div>
				<div class="column">
					<UserMenu
						@logout="logout"
						@edit-profile="showEditProfileModal"
					/>
				</div>
			</div>
			<div class="content-wrapper">
				<div class="chat">
					<MessagesList />
					<ChatControls />
				</div>

				<div class="users-list">
					<UserListItem
						v-for="user in users"
						:key="user.id"
						:user="user"
						:user-statuses="userStatuses"
						@click="showProfileModal"
					/>
				</div>
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
	import UserListItem from '@/components/UserListItem';
	import MessagesList from '@/components/chat/MessagesList';
	import ChatControls from '@/components/chat/ChatControls';
	import PlayButton from '@/components/PlayButton';
	import UserMenu from '@/components/UserMenu';
	import ChallengeModal from '@/components/modals/ChallengeModal';
	import ChallengePendingModal from '@/components/modals/ChallengePendingModal';
	import MatchmakingPendingModal from '@/components/modals/MatchmakingPendingModal';
	import UserProfileModal from '@/components/modals/user-profile/UserProfileModal';
	import EditProfileModal from '@/components/modals/EditProfileModal';

	export default {
		components: {
			LoadingIndicator,
			UserListItem,
			MessagesList,
			ChatControls,
			PlayButton,
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
				socket: null
			};
		},
		computed: {
			...mapState('auth', [
				'userSession'
			]),
			...mapState('config', [
				'userStatuses'
			]),
			...mapState('matchmaking', [
				'matchmakingEnabled',
				'matchmakingIsLoading'
			]),
			...mapGetters('lobby', [
				'users'
			]),
			...mapGetters('config', [
				'availableGames'
			])
		},
		async created() {
			await Promise.all([
				this.getUsers(),
				this.getMatchmakingStatus()
			]);

			this.getMessages({
				limit: 15,
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

				this.socket.on('error', (error) => {
					this.$toasted.global.apiError({
						message: this.$options.filters.errorsMap(error)
					});
				});

				this.socket.on('newUser', (user) => {
					this.newUserReceived(user);
				});

				this.socket.on('updateUser', (user) => {
					this.updateUser(user);
				});

				this.socket.on('updateUserStatuses', (statuses) => {
					this.updateUserStatuses(statuses);
				});

				this.socket.on('challenge', ({ user, game }) => {
					showChallengeModal({
						game,
						user
					});
				});

				this.socket.on('cancelChallenge', () => {
					hideChallengeModal();
				});

				this.socket.on('declineChallenge', () => {
					hideChallengePendingModal();
				});

				this.socket.on('foundMatch', (game) => {
					// automatically stop the matchmaking when a new match arrives
					this.setMatchmakingEnabled(false);

					showMatchmakingPendingModal({
						game
					});
				});

				this.socket.on('cancelMatchmakingChallenge', () => {
					hideMatchmakingPendingModal();
				});

				this.socket.on('goToGame', (game) => {
					this.$router.push({
						name: game
					});
				});

				this.socket.on('newMessage', (message) => {
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
			}

			.user-menu {
				float: right;
			}
		}

		.content-wrapper {
			display: flex;
			flex: 1;
			height: calc(100% - #{$header-height});

			.chat {
				flex: 1;
				display: flex;
				flex-direction: column;
				background-color: $gray;
			}

			.users-list {
				height: 100%;
				width: 250px;
				background-color: $gray-dark;
				overflow-y: auto;
			}
		}
	}
</style>
