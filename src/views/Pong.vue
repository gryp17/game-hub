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

		<canvas id="ball-canvas" class="canvas"></canvas>
		<canvas id="game-canvas" class="canvas" tabindex="1">
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
	import AudioPlayer from '@/services/audio-player';

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
		/**
		 * Preloads the game assets before starting the game
		 */
		mounted() {
			//preload the game images before connecting to the socket and starting the game
			Pong.preloadGameImages((gameImages) => {
				this.initGame(gameImages);
			});
		},
		/**
		 * Stops the game if it's still running and disconnects from the socket
		 */
		beforeDestroy() {
			if (this.game) {
				this.game.stop();
			}

			AudioPlayer.stopMusic();

			this.disconnectFromSocket();
		},
		computed: {
			...mapState('config', [
				'socketEvents'
			]),
			...mapGetters('auth', [
				'userSession'
			]),
			/**
			 * Returns the current game scores
			 * @returns {Array}
			 */
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
			initGame(gameImages) {
				//initialize the socket connection
				this.socket = SocketIO(`${config.socketUrl}/pong`, {
					transports: ['websocket'],
					upgrade: false
				});

				this.socket.on(this.socketEvents.error, (error) => {
					this.$toasted.global.apiError({
						message: this.$options.filters.errorsMap(error)
					});
				});

				//start the game
				this.socket.on(this.socketEvents.game.startGame, ({ config, player }) => {
					const canvasIds = {
						game: 'game-canvas',
						ball: 'ball-canvas'
					};

					this.game = new Pong(canvasIds, gameImages, config, player, {
						onUpdateInputs: this.updateInputs,
						playMusic: AudioPlayer.playMusic,
						playTrack: AudioPlayer.throttledPlayTrack
					});

					this.loading = false;
					this.game.start();
				});

				this.socket.on(this.socketEvents.game.updateData, (data) => {
					this.game.updateData(data);
				});

				this.socket.on(this.socketEvents.game.gameOver, ({ winner, ragequit, score }) => {
					showGameOverModal({
						winner,
						ragequit,
						score
					});
				});

				this.socket.on(this.socketEvents.game.exitGame, () => {
					this.$router.push({
						name: 'lobby'
					});
				});
			},
			/**
			 * Emits the update inputs event with the player's inputs data
			 */
			updateInputs(inputs) {
				this.socket.emit(this.socketEvents.game.updateInputs, inputs);
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

		.canvas {
			position: absolute;
			top: 0;
			left: 0;
			display: none;
			width: 100%;
			height: 100%;
			border: solid 3px $purple;
		}
	}
</style>
