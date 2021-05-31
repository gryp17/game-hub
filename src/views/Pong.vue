<template>
	<div class="pong-page">
		pong

		<canvas id="game-canvas" class="canvas">
			Your browser does not support HTML5 Canvas.
		</canvas>
	</div>
</template>

<script>
	import SocketIO from 'socket.io-client';
	import config from '@/config';
	import Pong from '@/game-clients/pong';

	export default {
		data() {
			return {
				socket: null,
				game: null
			};
		},
		async mounted() {
			this.game = new Pong({
				onUpdateInputs: this.updateInputs
			});
			this.connectToSocket();
		},
		beforeDestroy() {
			this.disconnectFromSocket();
		},
		methods: {
			/**
			 * Connects to the socket.io server and listens for it's events
			 */
			connectToSocket() {
				//initialize the socket connection
				this.socket = SocketIO(`${config.apiUrl}/pong`, {
					transports: ['websocket'],
					upgrade: false
				});

				this.socket.on('error', (error) => {
					this.$toasted.global.apiError({
						message: this.$options.filters.errorsMap(error)
					});
				});

				this.socket.on('startGame', ({ fps, canvas, player }) => {
					console.log('########### START GAME');

					this.game.start(fps, canvas, player);
				});

				this.socket.on('updateData', (data) => {
					this.game.updateData(data);
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
		#game-canvas {
			display: none;
			border: solid 1px $purple;
		}
	}
</style>
