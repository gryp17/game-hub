<template>
	<div class="user-profile-modal">
		<modal
			:adaptive="true"
			:scrollable="true"
			:width="'100%'"
			:maxWidth="560"
			:height="'auto'"
			name="user-profile-modal"
			@before-open="onBeforeOpen"
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
							<UserAvatar
								status-type="border"
								:avatar="userProfile.avatarLink"
								:title="userProfile.status.formatted"
								:status="userProfile.status.avatar"
								:size="160"
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
						<Tab
							name="Stats"
							class="user-stats"
						>
							<template v-if="gameStats">
								<GameResultsChart
									:won="gameStats.won"
									:lost="gameStats.lost"
									:ragequit="gameStats.ragequit"
								/>

								<GamesByTypeChart
									:games="gameStats.byType"
								/>
							</template>
						</Tab>
					</Tabs>
				</div>
			</template>
		</modal>
	</div>
</template>

<script>
	import { mapState, mapGetters, mapActions } from 'vuex';
	import { Tabs, Tab } from 'vue-tabs-component';
	import { showEditProfileModal, hideProfileModal } from '@/services/modal';
	import UserAvatar from '@/components/UserAvatar';
	import ChallengeButton from '@/components/ChallengeButton';
	import GameResultsChart from '@/components/charts/GameResultsChart';
	import GamesByTypeChart from '@/components/charts/GamesByTypeChart';

	export default {
		components: {
			Tabs,
			Tab,
			UserAvatar,
			ChallengeButton,
			GameResultsChart,
			GamesByTypeChart
		},
		data() {
			return {
				userId: null
			};
		},
		computed: {
			...mapState('config', [
				'userStatuses'
			]),
			...mapState('lobby', [
				'users',
				'gameStats'
			]),
			...mapGetters('auth', [
				'userSession'
			]),
			userProfile() {
				if (!this.userId) {
					return null;
				}

				return this.users[this.userId];
			},
			isOwnUser() {
				return this.userProfile.id === this.userSession.id;
			},
			canChallengePLayer() {
				return (
					this.userSession.status.raw === this.userStatuses.ONLINE
					&& this.userProfile.status.raw === this.userStatuses.ONLINE
					&& !this.isOwnUser
				);
			},
			bio() {
				return this.userProfile.bio ? this.userProfile.bio : 'Apparently, this user prefers to keep an air of mystery about them.';
			}
		},
		methods: {
			...mapActions('lobby', [
				'getGameStats',
				'getGameHistory'
			]),
			onBeforeOpen(e) {
				this.userId = e.params;

				this.getGameStats(this.userId);
				this.getGameHistory({
					userId: this.userId,
					limit: 5,
					offset: 0
				});
			},
			/**
			 * Closes the modal
			 */
			closeModal() {
				hideProfileModal();
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
					showEditProfileModal();
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

		.content {
			padding: 5px;

			.tabs-component-panels {
				padding: 10px;
			}

			.user-profile {
				text-align: center;

				.user-avatar {
					margin: 10px auto;
				}

				.username {
					margin-bottom: 20px;
					font-size: 20px;
					font-weight: bold;
				}

				.bio {
					margin-bottom: 20px;
				}

				.buttons-wrapper {
					margin-top: 10px;
				}
			}
		}
	}
</style>
