<template>
	<div class="challenge-modal">
		<modal
			:adaptive="true"
			:width="'100%'"
			:maxWidth="460"
			:height="'auto'"
			:clickToClose="false"
			name="challenge-modal"
			@before-open="onBeforeOpen"
			@opened="startCountdown"
			@before-close="stopCountdown"
		>
			<div class="header">
				Game challenge
			</div>
			<div class="content">
				You have been challenged in a game of <span class="bold">{{ game.label }}</span> by <span class="bold">{{ user.username }}</span>

				<ChallengeTimeoutCountdown
					ref="countdown"
					@timeout="decline"
				/>

				<div class="buttons-wrapper">
					<FormButton
						success
						@click="accept"
					>
						Accept
					</FormButton>
					<FormButton
						danger
						@click="decline"
					>
						Decline
					</FormButton>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
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
			/**
			 * Sets the file object
			 * @param {Object} e
			 */
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
				this.$modal.hide('challenge-modal');
			},
			accept() {
				this.stopCountdown();
				this.$emit('accept', this.user);
				this.closeModal();
			},
			decline() {
				this.$emit('decline', this.user);
				this.closeModal();
			}
		}
	};
</script>

<style lang="scss">
	.challenge-modal {
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
