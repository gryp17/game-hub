<template>
	<div class="challenge-pending-modal">
		<modal
			:adaptive="true"
			:width="'100%'"
			:maxWidth="460"
			:height="'auto'"
			:clickToClose="false"
			name="challenge-pending-modal"
			@before-open="onBeforeOpen"
			@opened="startCountdown"
			@before-close="stopCountdown"
		>
			<div class="header">
				Game challenge
			</div>
			<div class="content">
				You have challenged <span class="bold">{{ user.username }}</span> in a game of <span class="bold">{{ game.label }}</span>

				<ChallengeTimeoutCountdown
					ref="countdown"
					@timeout="cancel"
				/>

				<div class="buttons-wrapper">
					<FormButton
						danger
						@click="cancel"
					>
						Cancel
					</FormButton>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
	import { hideChallengePendingModal } from '@/services/modal';
	import ChallengeTimeoutCountdown from '@/components/modals/ChallengeTimeoutCountdown';

	export default {
		components: {
			ChallengeTimeoutCountdown
		},
		data() {
			return {
				user: {},
				game: {}
			};
		},
		methods: {
			onBeforeOpen(e) {
				this.user = e.params.user;
				this.game = this.$options.filters.gamesMap(e.params.game);
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
			/**
			 * Closes the modal
			 */
			closeModal() {
				hideChallengePendingModal();
			},
			cancel() {
				this.$emit('cancel', this.user);
				this.closeModal();
			}
		}
	};
</script>

<style lang="scss">
	.challenge-pending-modal {
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

			.buttons-wrapper {
				text-align: center;

				.form-button {
					margin-right: 5px;
				}
			}
		}
	}
</style>
