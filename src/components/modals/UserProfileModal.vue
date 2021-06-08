<template>
	<div class="user-profile-modal">
		<modal
			:adaptive="true"
			:width="'100%'"
			:maxWidth="460"
			:height="'auto'"
			name="user-profile-modal"
			@before-open="onBeforeOpen"
			@opened="startCountdown"
			@before-close="stopCountdown"
		>
			<div class="header">
				{{ user.username }}
			</div>
			<div class="content">

				User profile
				{{ user }}

				<FormButton
					v-if="canChallengePLayer"
					@click="challengePlayer"
				>
					Challenge
				</FormButton>

				<div class="buttons-wrapper">
					<FormButton
						danger
						@click="closeModal"
					>
						Close
					</FormButton>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
	import { mapState } from 'vuex';

	export default {
		data() {
			return {
				user: {}
			};
		},
		computed: {
			...mapState('auth', [
				'userSession'
			]),
			canChallengePLayer() {
				//TODO: use the status map here
				return (this.user.status === 'online' && this.user.id !== this.userSession.id);
			}
		},
		methods: {
			/**
			 * Sets the file object
			 * @param {Object} e
			 */
			onBeforeOpen(e) {
				this.user = e.params.user;
			},
			/**
			 * Closes the modal
			 */
			closeModal() {
				this.$modal.hide('user-profile-modal');
			},
			challengePlayer() {
				this.$emit('challenge', this.user);
			}
		}
	};
</script>

<style lang="scss">
	.user-profile-modal {
		.header {
			padding: 10px;
			background-color: $gray-darkest;
			color: $white;
			font-weight: bold;
		}

		.content {
			padding: 10px;
			color: $text-color-dark;

			.buttons-wrapper {
				text-align: center;
			}
		}
	}
</style>
