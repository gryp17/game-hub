<template>
	<div class="game-settings-modal">
		<modal
			:adaptive="true"
			:width="'100%'"
			:maxWidth="480"
			:height="'auto'"
			name="game-settings-modal"
			@before-open="onBeforeOpen"
		>
			<div class="header">
				Game settings
			</div>
			<div class="content center">

				settings form

				<div class="buttons-wrapper">
					<FormButton
						:disabled="submitting"
						@click="submit"
					>
						Save
					</FormButton>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import { hideGameSettingsModal } from '@/services/modal';

	export default {
		data() {
			return {
				submitting: false
			};
		},
		computed: {
			...mapGetters('auth', [
				'userSession'
			])
		},
		methods: {
			/**
			 * Bootstraps the modal before its opened
			 * @param {Object} e
			 */
			onBeforeOpen(e) {
				// TODO: initialize the data if necessary
			},
			/**
			 * Submits the game settings modal
			 */
			async submit() {
				if (this.submitting) {
					return;
				}

				this.submitting = true;

				//TODO: call the api

				this.submitting = false;
			},
			/**
			 * Closes the modal
			 */
			closeModal() {
				hideGameSettingsModal();
			}
		}
	};
</script>

<style lang="scss">
	.game-settings-modal {
		.content {

		}
	}
</style>
