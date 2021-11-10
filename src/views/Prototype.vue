<template>
	<div :class="['play-page', gameType]">
		<LoadingIndicator
			v-if="loading"
			full-screen
		/>

		<!-- game canvases are generated here automatically by each game -->
		<div class="canvas-wrapper"></div>
	</div>
</template>

<script>
	import { mapState, mapGetters, mapActions } from 'vuex';
	import LoadingIndicator from '@/components/LoadingIndicator';

	import Jumper from '../../games/jumper/entry-points/client';

	const gameClasses = {
		jumper: Jumper
	};

	export default {
		components: {
			LoadingIndicator
		},
		data() {
			return {
				socket: null,
				gameType: null,
				gameClass: null,
				game: null,
				loading: true
			};
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
		/**
		 * Sets the game type and class and preloads the game assets before starting the game
		 */
		mounted() {
			//sets the game type and game class
			this.gameType = 'jumper';
			this.GameClass = gameClasses[this.gameType];

			//if the game class is invalid redirect to the lobby
			if (!this.GameClass) {
				return this.$router.push({
					name: 'lobby'
				});
			}

			//preload the game images before connecting to the socket and starting the game
			this.GameClass.preloadGameImages(this.initGame);
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
				const canvasIds = {
					background: 'background-canvas',
					game: 'game-canvas',
					enemies: 'enemies-canvas'
				};

				const serverConfig = {
					code: 'jumper',
					maxPlayers: 2,
					fps: 60,
					width: 1366,
					height: 768,
					groundHeight: 15,
					maxScore: 1,
					dummy: {
						maxSpeed: 10,
						acceleration: 2,
						jumpAcceleration: 12,
						maxJumpHeight: 240
					},
					background: {
						availableBackgrounds: [
							'forest',
							'factory',
							'graveyard',
							'house'
						],
						selectedBackground: 'factory' //this value is actually randomized by the server
					},
					controls: {
						up: {
							keys: [38, 87] //arrow up, W
						},
						left: {
							keys: [37, 65] //left arrow, A
						},
						right: {
							keys: [39, 68] //right arrow, D
						}
					},
					configurableSettings: {}
				};

				//pick a random background
				serverConfig.background.selectedBackground = _.sample(serverConfig.background.availableBackgrounds);

				const player = 1;

				//start the game
				this.game = new this.GameClass(canvasIds, '.canvas-wrapper', gameImages, serverConfig, player, {
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
				this.game.start();
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
				// this.socket.emit(this.socketEvents.game.updateInputs, inputs);
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
