<template>
	<div :class="['play-page', gameType]">
		<LoadingIndicator
			v-if="loading"
			full-screen
		/>

		<!-- game canvases are generated here automatically by each game -->
		<div class="canvas-wrapper"></div>

		<GameHUD
			v-if="hudData"
			:data="hudData"
			:sound="sound"
			:music="music"
			@set-sound="onToggleSoundPreferences('sound', $event)"
			@set-music="onToggleSoundPreferences('music', $event)"
		/>

		<GameOverModal />
	</div>
</template>

<script>
	import { mapState, mapGetters, mapActions } from 'vuex';
	import SocketIO from 'socket.io-client';
	import LoadingIndicator from '@/components/LoadingIndicator';
	import GameHUD from '@/components/game-hud/GameHUD';
	import GameOverModal from '@/components/modals/GameOverModal';

	import config from '@/config';
	import { showGameOverModal } from '@/services/modal';
	import Pong from '../../games/pong/entry-points/client';
	import Volley from '../../games/volley/entry-points/client';
	import Jumper from '../../games/jumper/entry-points/client';

	const gameClasses = {
		pong: Pong,
		volley: Volley,
		jumper: Jumper
	};

	let GameClass;
	let game;

	export default {
		components: {
			LoadingIndicator,
			GameHUD,
			GameOverModal
		},
		data() {
			return {
				socket: null,
				gameType: null,
				hudData: null,
				loading: true
			};
		},
		computed: {
			...mapState('config', [
				'socketEvents'
			]),
			...mapState('settings', [
				'controls',
				'sound',
				'music'
			]),
			...mapGetters('auth', [
				'userSession'
			])
		},
		/**
		 * Sets the game type and class and preloads the game assets before starting the game
		 */
		mounted() {
			//sets the game type and game class
			this.gameType = this.$route.params.game;
			GameClass = gameClasses[this.gameType];

			//if the game class is invalid redirect to the lobby
			if (!GameClass) {
				return this.$router.push({
					name: 'lobby'
				});
			}

			//preload the game images before connecting to the socket and starting the game
			GameClass.preloadGameImages(this.initGame);
		},
		/**
		 * Stops the game if it's still running and disconnects from the socket
		 */
		beforeDestroy() {
			if (game) {
				game.stop();
			}

			this.stopMusic();

			this.disconnectFromSocket();
		},
		methods: {
			...mapActions('audio', [
				'playTrack',
				'playMusic',
				'stopMusic'
			]),
			...mapActions('settings', [
				'updateSettings'
			]),
			/**
			 * Connects to the socket.io server and listens for it's events
			 */
			initGame(gameImages) {
				//initialize the socket connection
				this.socket = SocketIO(config.socketGameNamespace, {
					transports: ['websocket'],
					upgrade: false
				});

				this.socket.on(this.socketEvents.error, (error) => {
					this.$toasted.global.apiError({
						message: this.$options.filters.errorsMap(error)
					});
				});

				//start the game
				this.socket.on(this.socketEvents.game.startGame, ({ canvasIds, config, player }) => {
					game = new GameClass(canvasIds, '.canvas-wrapper', gameImages, config, this.controls, player, {
						onUpdateInputs: this.updateInputs,
						playMusic: this.playMusic,
						playTrack: (track, volume) => {
							this.playTrack({
								track,
								volume
							});
						}
					});

					this.loading = false;
					game.start();
				});

				this.socket.on(this.socketEvents.game.updateData, (data) => {
					game.updateData(data);

					const hudData = game.hudData;

					//update the UI/HUD only if the data has changed
					if (!_.isEqual(this.hudData, hudData)) {
						this.hudData = game.hudData;
					}
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
			 * Sets the user's sound/music preferences
			 * @param {String} field (sound | music)
			 * @param {Boolean} value
			 */
			async onToggleSoundPreferences(field, value) {
				await this.updateSettings({
					[field]: value
				});

				//try to play/stop the music when the value changes
				if (field === 'music') {
					if (value) {
						this.playMusic();
					} else {
						this.stopMusic();
					}
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
	.play-page {
		display: flex;
		height: 100%;

		.canvas-wrapper {
			position: relative;
			width: 100%;
			height: 100%;

			.canvas {
				position: absolute;
				top: 0;
				left: 0;
				display: none;
				width: 100%;
				height: 100%;
			}
		}

		&.pong {
			.canvas-wrapper {
				.canvas {
					border: solid 3px $purple;
				}
			}
		}
	}
</style>
