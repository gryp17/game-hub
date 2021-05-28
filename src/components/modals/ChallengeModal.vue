<template>
	<div class="challenge-modal">
		<modal
			:adaptive="true"
			:width="'100%'"
			:maxWidth="460"
			:height="'auto'"
			name="challenge-modal"
			@before-open="onBeforeOpen"
			@closed="onClose"
		>
			<div class="header">
				Game challenge
			</div>
			<div class="content">
				You have been challenged in a game of ... by...
				<div class="counter">
					10
				</div>

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
	export default {
		methods: {
			/**
			 * Sets the file object
			 * @param {Object} e
			 */
			onBeforeOpen(e) {
				this.user = e.params;
			},
			/**
			 * Closes the modal
			 */
			closeModal() {
				this.$modal.hide('challenge-modal');
			},
			onClose() {
				this.$emit('decline', this.user);
			},
			accept() {
				this.$emit('accept', this.user);
			},
			decline() {
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
				padding-top: 10px;
				text-align: center;

				.form-button {
					margin-right: 5px;
				}
			}
		}
	}
</style>
