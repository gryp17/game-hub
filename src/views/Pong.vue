<template>
	<div class="pong-page">
		<LoadingIndicator
			v-if="loading"
			full-screen
		/>

		<canvas id="ball-canvas" class="canvas"></canvas>
		<canvas id="game-canvas" class="canvas" tabindex="1">
			Your browser does not support HTML5 Canvas.
		</canvas>

		<GameHUD
			:sound="userSession.sound"
			:music="userSession.music"
			:scores="scores"
			@set-sound="updateUserSoundPreferences({ sound: $event })"
			@set-music="onToggleMusic"
		/>

		<GameOverModal />
	</div>
</template>

<script>
	import { mapState, mapGetters, mapActions } from 'vuex';
	import SocketIO from 'socket.io-client';
	import LoadingIndicator from '@/components/LoadingIndicator';
	import GameHUD from '@/components/GameHUD';
	import GameOverModal from '@/components/modals/GameOverModal';

	import config from '@/config';
	import { showGameOverModal } from '@/services/modal';
	import Pong from '../../games/pong/entry-points/client';

	export default {
		components: {
			LoadingIndicator,
			GameHUD,
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

			this.stopMusic();

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
			...mapActions('audio', [
				'playTrack',
				'playMusic',
				'stopMusic'
			]),
			...mapActions('auth', [
				'updateUserSoundPreferences'
			]),
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
						playMusic: this.playMusic,
						playTrack: this.playTrack
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
			 * Sets the user music value
			 * @param {Boolean} value
			 * @returns {Promise}
			 */
			async onToggleMusic(value) {
				await this.updateUserSoundPreferences({ music: value });

				//try to play/stop the music when the value changes
				if (value) {
					this.playMusic();
				} else {
					this.stopMusic();
				}
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
