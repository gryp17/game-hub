<template>
	<div class="user-profile-modal">
		<modal
			:adaptive="true"
			:width="'100%'"
			:maxWidth="560"
			:height="'auto'"
			name="user-profile-modal"
		>
			<template v-if="userProfile">
				<div class="header">
					{{ userProfile.username }}

					<FormButton
						transparent
						class="close-btn"
						@click="closeModal"
					>
						<i class="fas fa-times"></i>
					</FormButton>
				</div>
				<div class="content">
					<Tabs
						cache-lifetime="0"
						class="light"
						:options="{ useUrlFragment: false }"
					>
						<Tab
							name="Profile"
							class="user-profile"
						>
							<img
								class="avatar"
								:src="userProfile.avatarLink"
							/>

							<div class="username">
								{{ userProfile.username }}
							</div>

							<div class="bio">
								{{ bio }}
							</div>

							<div class="buttons-wrapper">
								<FormButton
									v-if="isOwnUser"
									@click="editProfile"
								>
									Edit profile
								</FormButton>
								<ChallengeButton
									v-else
									:disabled="!canChallengePLayer"
									@challenge="challengePlayer"
								/>
							</div>
						</Tab>
						<Tab name="Stats">
							stats placeholder
						</Tab>
					</Tabs>
				</div>
			</template>
		</modal>
	</div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex';
	import { Tabs, Tab } from 'vue-tabs-component';
	import ChallengeButton from '@/components/ChallengeButton';

	export default {
		components: {
			Tabs,
			Tab,
			ChallengeButton
		},
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
			isOwnUser() {
				return this.userProfile.id === this.userSession.id;
			},
			canChallengePLayer() {
				return (
					this.userSession.status === this.userStatuses.ONLINE
					&& this.userProfile.status === this.userStatuses.ONLINE
					&& !this.isOwnUser
				);
			},
			bio() {
				return this.userProfile.bio ? this.userProfile.bio : 'Apparently, this user prefers to keep an air of mystery about them.';
			}
		},
		methods: {
			/**
			 * Closes the modal
			 */
			closeModal() {
				this.$modal.hide('user-profile-modal');
			},
			challengePlayer(game) {
				this.closeModal();
				setTimeout(() => {
					this.$emit('challenge', {
						user: this.userProfile,
						game
					});
				}, 200);
			},
			editProfile() {
				this.closeModal();
				setTimeout(() => {
					this.$modal.show('edit-profile-modal');
				}, 200);
			}
		}
	};
</script>

<style lang="scss">
	.user-profile-modal {
		//make this modal appear under any other newly opened modals (in case there are more opened modals at the same time)
		.vm--container {
			z-index: 998;
		}

		//fixes a bug with the dropdown button
		.vm--modal {
			overflow: unset;
		}

		.header {
			padding: 10px;
			background-color: $gray-darkest;
			color: $white;
			font-weight: bold;

			.close-btn {
				float: right;
				padding: 0px 5px;
				color: $white;

				svg {
					margin: 0px;
				}

				&:hover {
					background-color: $gray;
				}
			}
		}

		.content {
			padding: 5px;
			color: $text-color-dark;

			.tabs-component-panels {
				padding: 10px;
			}

			.user-profile {
				.avatar {
					display: block;
					margin: 10px auto;
					width: 160px;
					height: 160px;
					border-radius: 100%;
				}

				.username {
					margin-bottom: 20px;
					text-align: center;
					font-size: 20px;
					font-weight: bold;
				}

				.bio {
					margin-bottom: 20px;
					text-align: center;
				}

				.buttons-wrapper {
					margin-top: 10px;
					text-align: center;
				}
			}
		}
	}
</style>
