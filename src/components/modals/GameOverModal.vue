<template>
	<div class="game-over-modal">
		<modal
			:adaptive="true"
			:width="'100%'"
			:maxWidth="460"
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
			<div class="content">
				Game over text

				<div v-if="isWinner">
					You have won
				</div>
				<div v-else>
					You have lost
				</div>

				{{ ragequit }}
				{{ score }}

				<ChallengeTimeoutCountdown
					:timeout="5"
					ref="countdown"
					@timeout="redirectToLobby"
				/>
			</div>
		</modal>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import { hideGameOverModal } from '@/services/modal';
	import ChallengeTimeoutCountdown from '@/components/modals/ChallengeTimeoutCountdown';

	export default {
		components: {
			ChallengeTimeoutCountdown
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
			isWinner() {
				return this.userSession.id === this.winner;
			}
		},
		methods: {
			onBeforeOpen(e) {
				this.winner = e.params.winner;
				this.ragequit = e.params.ragequit;
				this.score = e.params.score;
			},
			startCountdown() {
				if (this.$refs.countdown) {
					this.$refs.countdown.startCountdown();
				}
			},
			stopCountdown() {
				if (this.$refs.countdown) {
					this.$refs.countdown.stopCountdown();
				}
			},
			redirectToLobby() {
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
		.header {
			padding: 10px;
			background-color: $gray-darkest;
			color: $white;
			font-weight: bold;
		}

		.content {
			padding: 10px;
			text-align: center;
			color: $text-color-dark;
		}
	}
</style>
