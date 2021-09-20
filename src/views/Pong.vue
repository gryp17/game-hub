<template>
	<div class="pong-page">
		<LoadingIndicator
			v-if="loading"
			full-screen
		/>

		<div class="hud">
			<div
				v-for="item in scores"
				:key="item.id"
				class="player-info"
			>
				<div class="username">
					{{ item.username }}
				</div>
				<div class="score">
					{{ item.score }}
				</div>
			</div>
		</div>

		<canvas id="game-canvas" class="canvas">
			Your browser does not support HTML5 Canvas.
		</canvas>

		<GameOverModal />
	</div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex';
	import SocketIO from 'socket.io-client';
	import LoadingIndicator from '@/components/LoadingIndicator';
	import GameOverModal from '@/components/modals/GameOverModal';

	import config from '@/config';
	import { showGameOverModal } from '@/services/modal';
	import Pong from '../../games/pong/entry-points/client';

	export default {
		components: {
			LoadingIndicator,
			GameOverModal
		},
		data() {
			return {
				socket: null,
				game: null,
				loading: true
			};
		},
		async mounted() {
			this.connectToSocket();
		},
		beforeDestroy() {
			if (this.game) {
				this.game.stop();
			}
			this.disconnectFromSocket();
		},
		computed: {
			...mapState('config', [
				'socketEvents'
			]),
			...mapGetters('auth', [
				'userSession'
			]),
			scores() {
				if (!this.game) {
					return [];
				}

				return Object.values(this.game.scores);
			}
		},
		methods: {
			/**
			 * Connects to the socket.io server and listens for it's events
			 */
			connectToSocket() {
				//initialize the socket connection
				this.socket = SocketIO(`${config.socketUrl}/pong`, {
					transports: ['websocket'],
					upgrade: false
				});

				this.socket.on(this.socketEvents.ERROR, (error) => {
					this.$toasted.global.apiError({
						message: this.$options.filters.errorsMap(error)
					});
				});

				this.socket.on(this.socketEvents.GAME.START_GAME, ({ config, player }) => {
					this.game = new Pong('game-canvas', config, player, {
						onGameReady: () => {
							this.game.start();
							this.loading = false;
						},
						onUpdateInputs: this.updateInputs
					});
				});

				this.socket.on(this.socketEvents.GAME.UPDATE_DATA, (data) => {
					this.game.updateData(data);
				});

				this.socket.on(this.socketEvents.GAME.GAME_OVER, ({ winner, ragequit, score }) => {
					showGameOverModal({
						winner,
						ragequit,
						score
					});
				});

				this.socket.on(this.socketEvents.GAME.EXIT_GAME, () => {
					this.$router.push({
						name: 'lobby'
					});
				});
			},
			updateInputs(inputs) {
				this.socket.emit(this.socketEvents.GAME.UPDATE_INPUTS, inputs);
			},
			/**
			 * Disconnects from the socket.io server
			 */
			disconnectFromSocket() {
				if (this.socket) {
					this.socket.disconnect();
				}
			}
		}
	};
</script>

<style lang="scss">
	.pong-page {
		display: flex;
		height: 100%;
		justify-content: center;

		.hud {
			position: absolute;
			display: flex;
			justify-content: center;
			width: 100%;
			height: 100%;

			.player-info {
				padding: 25px;
				text-align: center;

				.username {
					font-size: 32px;
				}

				.score {
					margin-top: 5px;
					font-size: 28px;
				}
			}
		}

		#game-canvas {
			display: none;
			width: 100%;
			border: solid 3px $purple;
		}
	}
</style>
