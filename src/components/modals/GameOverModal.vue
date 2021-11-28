<template>
	<div class="game-over-modal">
		<modal
			:adaptive="true"
			:scrollable="true"
			:width="'100%'"
			:maxWidth="570"
			:height="'auto'"
			:clickToClose="false"
			name="game-over-modal"
			@before-open="onBeforeOpen"
			@opened="startCountdown"
			@before-close="stopCountdown"
		>
			<div class="header">
				Game over
			</div>
			<div class="content center">

				<div class="game-over-icon-wrapper">
					<i :class="icon"></i>
				</div>

				<div class="game-over-text">
					{{ text }}
				</div>

				You will be redirected to the lobby in

				<TimeoutCountdown
					:timeout="10"
					ref="countdown"
					@timeout="redirectToLobby"
				/>

				<div class="buttons-wrapper">
					<FormButton
						@click="redirectToLobby"
					>
						Take me to the lobby
					</FormButton>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import { hideGameOverModal } from '@/services/modal';
	import TimeoutCountdown from '@/components/TimeoutCountdown';

	export default {
		components: {
			TimeoutCountdown
		},
		data() {
			return {
				winner: null,
				ragequit: false,
				score: null
			};
		},
		computed: {
			...mapGetters('auth', [
				'userSession'
			]),
			/**
			 * Indicates whether the user has won
			 * @returns {Boolean}
			 */
			isWinner() {
				return this.userSession.id === this.winner;
			},
			/**
			 * Returns the correct icon depending on the game result
			 * @returns {String}
			 */
			icon() {
				if (this.isWinner) {
					if (this.ragequit) {
						return 'fas fa-grin-tears color-pink';
					}

					return 'fas fa-thumbs-up color-green';
				}

				return 'fas fa-meh color-yellow';
			},
			/**
			 * Returns the message depending on the game result
			 * @returns {String}
			 */
			text() {
				if (this.isWinner) {
					if (this.ragequit) {
						return 'LOL! Your opponent just ragequit!';
					}

					return 'You won!';
				}

				return 'You lost. Better luck next time.';
			}
		},
		methods: {
			/**
			 * Bootstraps the modal before its opened
			 * @param {Object} e
			 */
			onBeforeOpen(e) {
				this.winner = e.params.winner;
				this.ragequit = e.params.ragequit;
				this.score = e.params.score;
			},
			/**
			 * Starts the countodnw
			 */
			startCountdown() {
				if (this.$refs.countdown) {
					this.$refs.countdown.startCountdown();
				}
			},
			/**
			 * Stops the countdown
			 */
			stopCountdown() {
				if (this.$refs.countdown) {
					this.$refs.countdown.stopCountdown();
				}
			},
			/**
			 * Redirects the user to the lobby page
			 */
			redirectToLobby() {
				this.stopCountdown();

				this.$router.push({
					name: 'lobby'
				});
			},
			/**
			 * Closes the modal
			 */
			closeModal() {
				hideGameOverModal();
			}
		}
	};
</script>

<style lang="scss">
	.game-over-modal {
		.content {
			.game-over-icon-wrapper {
				margin-bottom: 10px;
				font-size: 84px;
			}

			.game-over-text {
				margin-bottom: 10px;
				font-size: 32px;
			}
		}
	}
</style>
