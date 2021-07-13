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
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
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
			this.connectToSocket();
		},
		beforeDestroy() {
			if (this.game) {
				this.game.stop();
			}
			this.disconnectFromSocket();
		},
		computed: {
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

				this.socket.on('error', (error) => {
					this.$toasted.global.apiError({
						message: this.$options.filters.errorsMap(error)
					});
				});

				this.socket.on('startGame', ({ config, player }) => {
					this.game = new Pong('game-canvas', config, player, {
						onUpdateInputs: this.updateInputs
					});

					this.game.start();
					this.loading = false;
				});

				this.socket.on('updateData', (data) => {
					this.game.updateData(data);
				});

				this.socket.on('gameOver', (winnerId) => {
					//TODO: use a modal here and redirect the players to the lobby in X seconds
					if (this.userSession.id === winnerId) {
						alert('YOU HAVE WON!!!');
					} else {
						alert('YOU HAVE LOST...');
					}
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
