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
					<UserMenu />
				</div>
			</div>
			<div class="content-wrapper">
				<div class="chat-wrapper">
					<div class="messages-list">
						<div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div>
						<div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div>
						<div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div>
						<div>message</div><div>message</div><div>message</div><div>message</div><div>message</div>
						<div>message</div><div>message</div><div>message</div><div>message</div><div>message</div>
					</div>
					<div class="controls">
						controls
					</div>
				</div>
				<div class="users-list">
					<UserItem
						v-for="user in users"
						:key="user.id"
						:user="user"
						@click="openUserProfile"
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
	import config from '@/config';
	import LoadingIndicator from '@/components/LoadingIndicator';
	import UserItem from '@/components/users-list/UserItem';
	import PlayButton from '@/components/PlayButton';
	import UserMenu from '@/components/UserMenu';
	import ChallengeModal from '@/components/modals/ChallengeModal';
	import ChallengePendingModal from '@/components/modals/ChallengePendingModal';
	import MatchmakingPendingModal from '@/components/modals/MatchmakingPendingModal';
	import UserProfileModal from '@/components/modals/UserProfileModal';
	import EditProfileModal from '@/components/modals/EditProfileModal';

	export default {
		components: {
			LoadingIndicator,
			UserItem,
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
			...mapState('matchmaking', [
				'matchmakingEnabled',
				'matchmakingIsLoading'
			]),
			...mapGetters('lobby', [
				'users'
			])
		},
		async created() {
			await Promise.all([
				this.getUsers(),
				this.getMatchmakingStatus()
			]);

			this.connectToSocket();
			this.loading = false;
		},
		beforeDestroy() {
			this.disconnectFromSocket();
		},
		methods: {
			...mapActions('lobby', [
				'getUsers',
				'newUserReceived',
				'updateUser',
				'updateUserStatuses',
				'challengePlayer',
				'cancelChallenge',
				'declineChallenge',
				'acceptChallenge',
				'setSelectedUser'
			]),
			...mapActions('matchmaking', [
				'getMatchmakingStatus',
				'startMatchmaking',
				'stopMatchmaking',
				'setMatchmakingEnabled',
				'cancelMatchmakingChallenge',
				'acceptMatchmakingChallenge'
			]),
			openUserProfile(user) {
				this.setSelectedUser(user.id);
				this.$modal.show('user-profile-modal');
			},
			async onChallengePlayer({ user, game }) {
				const success = await this.challengePlayer({
					userId: user.id,
					game
				});

				if (success) {
					this.$modal.show('challenge-pending-modal', {
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
					this.$modal.show('challenge-modal', {
						game,
						user
					});
				});

				this.socket.on('cancelChallenge', () => {
					this.$modal.hide('challenge-modal');
				});

				this.socket.on('declineChallenge', () => {
					this.$modal.hide('challenge-pending-modal');
				});

				this.socket.on('foundMatch', (game) => {
					// automatically stop the matchmaking when a new match arrives
					this.setMatchmakingEnabled(false);

					this.$modal.show('matchmaking-pending-modal', {
						game
					});
				});

				this.socket.on('cancelMatchmakingChallenge', () => {
					this.$modal.hide('matchmaking-pending-modal');
				});

				this.socket.on('goToGame', (game) => {
					this.$router.push({
						name: game
					});
				});

				this.socket.on('newMessage', (message) => {
					console.log('GOT A NEW MESSAGE', message);
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

			.chat-wrapper {
				display: flex;
				flex-direction: column;
				flex: 1;
				background-color: $gray;

				.messages-list {
					display: flex;
					flex-direction: column-reverse;
					overflow-y: auto;

					> div {
						padding: 10px;
					}
				}

				.controls {
					padding: 20px 15px;
					background-color: $gray-dark;
					border-right: solid 1px $gray-darkest;
				}
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
