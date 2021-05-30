<template>
	<div class="pong-page">
		pong
	</div>
</template>

<script>
	import SocketIO from 'socket.io-client';
	import config from '@/config';
	import Keyboard from '@pong/keyboard';

	console.log(Keyboard);

	export default {
		data() {
			return {
				socket: null
			};
		},
		async created() {
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

				this.socket.on('startGame', () => {
					console.log('########### START GAME');
				});
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
