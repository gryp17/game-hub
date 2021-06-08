<template>
	<div class="user-profile-modal">
		<modal
			:adaptive="true"
			:width="'100%'"
			:maxWidth="460"
			:height="'auto'"
			name="user-profile-modal"
		>
			<template v-if="userProfile">
				<div class="header">
					{{ userProfile.username }}
				</div>
				<div class="content">

					User profile
					{{ userProfile }}

					<FormButton
						:disabled="!canChallengePLayer"
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
			</template>
		</modal>
	</div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex';

	export default {
		computed: {
			...mapState('config', [
				'userStatuses'
			]),
			...mapGetters('lobby', [
				'userProfile'
			]),
			...mapGetters('auth', [
				'userSession'
			]),
			canChallengePLayer() {
				return (
					this.userSession.status === this.userStatuses.ONLINE
					&& this.userProfile.status === this.userStatuses.ONLINE
					&& this.userProfile.id !== this.userSession.id
				);
			}
		},
		methods: {
			/**
			 * Closes the modal
			 */
			closeModal() {
				this.$modal.hide('user-profile-modal');
			},
			challengePlayer() {
				this.$emit('challenge', this.userProfile);
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
