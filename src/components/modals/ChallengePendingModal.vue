<template>
	<div class="challenge-pending-modal">
		<modal
			:adaptive="true"
			:width="'100%'"
			:maxWidth="460"
			:height="'auto'"
			name="challenge-pending-modal"
			@before-open="onBeforeOpen"
			@closed="onClose"
		>
			<div class="header">
				Game challenge
			</div>
			<div class="content">
				You have challenged ... in a game of ...
				<div class="counter">
					10
				</div>

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
	export default {
		data() {
			return {
				user: null
			};
		},
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
				this.$modal.hide('challenge-pending-modal');
			},
			onClose() {
				this.$emit('cancel', this.user);
			},
			cancel() {
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
				padding-top: 10px;
				text-align: center;

				.form-button {
					margin-right: 5px;
				}
			}
		}
	}
</style>
