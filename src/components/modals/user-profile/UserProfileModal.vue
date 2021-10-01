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
						ref="tabs"
						cache-lifetime="0"
						class="light"
						:options="{ useUrlFragment: false }"
					>
						<Tab
							name="Profile"
						>
							<ProfileTab
								:user-profile="userProfile"
								:user-session="userSession"
								:user-statuses="userStatuses"
								@edit-profile="editProfile"
								@challenge-player="challengePlayer"
							/>
						</Tab>
						<Tab
							name="Stats"
							class="user-stats"
						>
							<NoData v-if="gameStats.total === 0" />
							<template v-else>
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
						<Tab
							name="History"
							class="game-history"
						>
							<GameHistoryTab
								:total="gameHistory.total"
								:games="gameHistory.games"
								:games-per-page="gamesPerPage"
								:user-profile="userProfile"
								@get-games="getGames"
								@open-profile="changeUserProfile"
							/>
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
	import { showEditProfileModal, hideProfileModal, showChallengeSettingsModal } from '@/services/modal';
	import GameResultsChart from '@/components/charts/GameResultsChart';
	import GamesByTypeChart from '@/components/charts/GamesByTypeChart';
	import ProfileTab from '@/components/modals/user-profile/ProfileTab';
	import GameHistoryTab from '@/components/modals/user-profile/GameHistoryTab';
	import NoData from '@/components/modals/user-profile/NoData';

	export default {
		components: {
			Tabs,
			Tab,
			GameResultsChart,
			GamesByTypeChart,
			ProfileTab,
			GameHistoryTab,
			NoData
		},
		data() {
			return {
				userId: null,
				gamesPerPage: 3
			};
		},
		computed: {
			...mapState('config', [
				'userStatuses'
			]),
			...mapGetters('lobby', [
				'usersMap'
			]),
			...mapGetters('auth', [
				'userSession'
			]),
			...mapGetters('lobby', [
				'gameHistory'
			]),
			userProfile() {
				if (!this.userId) {
					return null;
				}

				return this.usersMap[this.userId];
			},
			gameStats() {
				return this.userProfile.gameStats;
			}
		},
		methods: {
			...mapActions('lobby', [
				'getGameHistory'
			]),
			onBeforeOpen(e) {
				this.userId = e.params;

				this.getGames({
					limit: this.gamesPerPage,
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
					showChallengeSettingsModal({
						userId: this.userId,
						game
					});
				}, 200);
			},
			editProfile() {
				this.closeModal();
				setTimeout(() => {
					showEditProfileModal();
				}, 200);
			},
			getGames({ limit, offset }) {
				this.getGameHistory({
					userId: this.userId,
					limit,
					offset
				});
			},
			changeUserProfile(userId) {
				//manually call the onBeforeOpen listener with the new user id and switch to the profile tab
				this.onBeforeOpen({
					params: userId
				});

				this.$refs.tabs.selectTab('#profile');
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
		}
	}
</style>
