<template>
	<div class="volley-page">
		<LoadingIndicator
			v-if="loading"
			full-screen
		/>

		<canvas id="background-canvas" class="canvas"></canvas>
		<canvas id="ball-canvas" class="canvas"></canvas>
		<canvas id="game-canvas" class="canvas" tabindex="1">
			Your browser does not support HTML5 Canvas.
		</canvas>

		<GameHUD
			:sound="userSession.sound"
			:music="userSession.music"
			:scores="[
				{
					id: 1,
					username: 'gryp',
					score: 5
				},
				{
					id: 2,
					username: 'leank',
					score: 0
				}
			]"
			@set-sound="updateUserSoundPreferences({ sound: $event })"
			@set-music="updateUserSoundPreferences({ music: $event })"
		/>
	</div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';
	import AudioPlayer from '@/services/audio-player';
	import LoadingIndicator from '@/components/LoadingIndicator';
	import GameHUD from '@/components/GameHUD';
	import Volley from '../../games/volley/entry-points/client';

	export default {
		components: {
			LoadingIndicator,
			GameHUD
		},
		data() {
			return {
				socket: null,
				game: null,
				loading: true
			};
		},
		computed: {
			...mapGetters('auth', [
				'userSession'
			])
		},
		/**
		 * Preloads the game assets before starting the game
		 */
		mounted() {
			//preload the game images before connecting to the socket and starting the game
			Volley.preloadGameImages((gameImages) => {
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

			// TODO: disconnect from sockets
		},
		methods: {
			...mapActions('auth', [
				'updateUserSoundPreferences'
			]),
			/**
			 * Connects to the socket.io server and listens for it's events
			 */
			initGame(gameImages) {
				// TODO: move this config to the backend once it's finalized
				const config = {
					fps: 60,
					width: 1366,
					height: 768,
					groundHeight: 15,
					dummy: {
						minForce: 3,
						verticalForce: 150,
						horizontalForce: 10
					},
					controls: {
						up: {
							keys: [38, 87] //arrow up, W
						},
						down: {
							keys: [40, 83] //arrow down, S
						},
						left: {
							keys: [37, 65] //left arrow, A
						},
						right: {
							keys: [39, 68] //right arrow, D
						}
					}
				};

				const canvasIds = {
					game: 'game-canvas',
					ball: 'ball-canvas',
					background: 'background-canvas'
				};

				this.game = new Volley(canvasIds, gameImages, config, {
					onUpdateInputs: () => {},
					playMusic: AudioPlayer.playMusic,
					playTrack: AudioPlayer.throttledPlayTrack
				});

				this.loading = false;
				this.game.start();
			}
		}
	};
</script>

<style lang="scss">
	.volley-page {
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
		}
	}
</style>
