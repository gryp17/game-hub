<template>
	<div class="matchmaking-pending-modal">
		<modal
			:adaptive="true"
			:width="'100%'"
			:maxWidth="460"
			:height="'auto'"
			name="matchmaking-pending-modal"
			@before-open="onBeforeOpen"
			@opened="startCountdown"
			@before-close="stopCountdown"
			@closed="onClose"
		>
			<div class="header">
				Opponent found
			</div>
			<div class="content">
				An opponent has been found for a game of <span class="bold">{{ game }}</span>
				<br/>
				<br/>
				Starting match in:
				<br/>

				<ChallengeTimeoutCountdown
					ref="countdown"
					@timeout="accept"
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
	import ChallengeTimeoutCountdown from '@/components/modals/ChallengeTimeoutCountdown';

	export default {
		components: {
			ChallengeTimeoutCountdown
		},
		data() {
			return {
				game: null
			};
		},
		methods: {
			/**
			 * Sets the file object
			 * @param {Object} e
			 */
			onBeforeOpen(e) {
				this.game = e.params.game;
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
				this.$modal.hide('matchmaking-pending-modal');
			},
			onClose() {
				this.$emit('cancel');
			},
			cancel() {
				this.closeModal();
			},
			accept() {
				this.$emit('accept');
			}
		}
	};
</script>

<style lang="scss">
	.matchmaking-pending-modal {
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
			}
		}
	}
</style>
