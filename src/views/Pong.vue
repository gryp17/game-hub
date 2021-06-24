<template>
	<div class="pong-page">
		<LoadingIndicator
			v-if="loading"
			full-screen
		/>

		<canvas id="game-canvas" class="canvas">
			Your browser does not support HTML5 Canvas.
		</canvas>
	</div>
</template>

<script>
	import SocketIO from 'socket.io-client';
	import LoadingIndicator from '@/components/LoadingIndicator';

	import config from '@/config';
	import Pong from '../../games/pong/entry-points/client';

	export default {
		components: {
			LoadingIndicator
		},
		data() {
			return {
				socket: null,
				game: null,
				loading: true
			};
		},
		async mounted() {
			this.game = new Pong({
				onUpdateInputs: this.updateInputs
			});
			this.connectToSocket();
		},
		beforeDestroy() {
			this.game.stop();
			this.disconnectFromSocket();
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

				this.socket.on('error', (error) => {
					this.$toasted.global.apiError({
						message: this.$options.filters.errorsMap(error)
					});
				});

				this.socket.on('startGame', ({ fps, canvas, player }) => {
					this.game.start(fps, canvas, player);
					this.loading = false;
				});

				this.socket.on('updateData', (data) => {
					this.game.updateData(data);
				});

				this.socket.on('exitGame', () => {
					this.$router.push({
						name: 'lobby'
					});
				});
			},
			updateInputs(inputs) {
				this.socket.emit('updateInputs', inputs);
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

		#game-canvas {
			display: none;
			width: 100%;
			border: solid 3px $purple;
		}
	}
</style>
