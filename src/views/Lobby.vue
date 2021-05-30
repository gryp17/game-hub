<template>
	<div class="lobby-page">
		<LoadingIndicator
			v-if="loading"
			full-screen
		/>
		<template v-else>
			<div class="page-header">
				<div class="column">

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
					<!-- user menu goes here -->
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
						@click="challengePlayer"
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
	</div>
</template>

<script>
	import SocketIO from 'socket.io-client';
	import { mapState, mapGetters, mapActions } from 'vuex';
	import config from '@/config';
	import LoadingIndicator from '@/components/LoadingIndicator';
	import UserItem from '@/components/users-list/UserItem';
	import ChallengeModal from '@/components/modals/ChallengeModal';
	import ChallengePendingModal from '@/components/modals/ChallengePendingModal';

	export default {
		components: {
			LoadingIndicator,
			UserItem,
			ChallengeModal,
			ChallengePendingModal
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
			...mapGetters('lobby', [
				'users'
			])
		},
		async created() {
			await this.getUsers();
			this.connectToSocket();
			this.loading = false;
		},
		beforeDestroy() {
			this.disconnectFromSocket();
		},
		methods: {
			...mapActions('lobby', [
				'getUsers'
			]),
			challengePlayer(user) {
				//TODO: check user status as well

				if (user.id !== this.userSession.id) {
					this.socket.emit('challengePlayer', user.id);
					this.$modal.show('challenge-pending-modal', {
						game: 'Pong',
						user
					});
				}
			},
			/**
			 * Connects to the socket.io server and listens for it's events
			 */
			connectToSocket() {
				//initialize the socket connection
				this.socket = SocketIO(`${config.apiUrl}/lobby`, {
					transports: ['websocket'],
					upgrade: false
				});

				this.socket.on('error', (error) => {
					this.$toasted.global.apiError({
						message: this.$options.filters.errorsMap(error)
					});
				});

				this.socket.on('challenge', (user) => {
					this.$modal.show('challenge-modal', {
						game: 'Pong',
						user
					});
				});

				this.socket.on('cancelChallenge', () => {
					this.$modal.hide('challenge-modal');
				});

				this.socket.on('declineChallenge', () => {
					this.$modal.hide('challenge-pending-modal');
				});

				this.socket.on('goToGame', () => {
					this.$router.push({
						name: 'pong'
					});
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
				this.socket.emit('acceptChallenge', user.id);
			},
			onChallengeDeclined(user) {
				this.socket.emit('declineChallenge', user.id);
			},
			onChallengeCanceled(user) {
				this.socket.emit('cancelChallenge', user.id);
			}
		}
	};
</script>

<style lang="scss">
	$header-height: 48px;

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
				margin-top: -10px;
				width: 115px;
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
