<template>
	<div class="profile-tab">
		<UserAvatar
			status-type="border"
			:avatar="userProfile.avatarLink"
			:title="userProfile.status.formatted"
			:status="userProfile.status.avatar"
			:size="160"
		/>

		<div class="username-wrapper">
			{{ userProfile.username }}

			<RagequitIndicator :percentage="userProfile.gameStats.ragequitPercentage"/>

			<LevelLabel
				:level="userProfile.experience.level"
				:color=" userProfile.experience.color"
			/>
		</div>

		<div class="bio">
			{{ bio }}
		</div>

		<ExperienceBar
			v-if="isOwnUser"
			:experience="userProfile.experience.value"
			:min-experience="userProfile.experience.currentLevelExperience"
			:max-experience="userProfile.experience.nextLevelExperience"
			:level="userProfile.experience.level"
			:next-level="userProfile.experience.nextLevel"
			:percentage="userProfile.experience.percentage"
		/>

		<div class="buttons-wrapper">
			<FormButton
				v-if="isOwnUser"
				@click="$emit('edit-profile')"
			>
				Edit profile
			</FormButton>
			<ChallengeButton
				v-else
				:disabled="!canChallengePLayer"
				@challenge="$emit('challenge-player', $event)"
			/>
		</div>
	</div>
</template>

<script>
	import UserAvatar from '@/components/UserAvatar';
	import RagequitIndicator from '@/components/RagequitIndicator';
	import LevelLabel from '@/components/modals/user-profile/LevelLabel';
	import ExperienceBar from '@/components/modals/user-profile/ExperienceBar';
	import ChallengeButton from '@/components/ChallengeButton';

	export default {
		components: {
			UserAvatar,
			RagequitIndicator,
			LevelLabel,
			ExperienceBar,
			ChallengeButton
		},
		props: {
			userProfile: Object,
			userSession: Object,
			userStatuses: Object
		},
		computed: {
			/**
			 * Indicates whether the opened profile belongs to the logged in user
			 * @returns {Boolean}
			 */
			isOwnUser() {
				return this.userProfile.id === this.userSession.id;
			},
			/**
			 * Indicates whether the opened profile can be challenged
			 * @returns {Boolean}
			 */
			canChallengePLayer() {
				return (
					this.userSession.status.raw === this.userStatuses.online
					&& this.userProfile.status.raw === this.userStatuses.online
					&& !this.isOwnUser
				);
			},
			/**
			 * Returns the user's bio
			 * @returns {String}
			 */
			bio() {
				return this.userProfile.bio ? this.userProfile.bio : 'Apparently, this user prefers to keep an air of mystery about them.';
			}
		}
	};
</script>

<style lang="scss">
	.profile-tab {
		text-align: center;

		.user-avatar {
			margin: 10px auto;
		}

		.username-wrapper {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 20px;
			font-size: 20px;
			font-weight: bold;
		}

		.ragequit-indicator {
			margin-left: 5px;
		}

		.bio {
			margin-bottom: 20px;
		}

		.experience-bar {
			margin-bottom: 20px;
		}

		.buttons-wrapper {
			margin-top: 10px;
		}
	}
</style>
