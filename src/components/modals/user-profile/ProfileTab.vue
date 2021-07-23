<template>
	<div class="profile-tab">
		<UserAvatar
			status-type="border"
			:avatar="userProfile.avatarLink"
			:title="userProfile.status.formatted"
			:status="userProfile.status.avatar"
			:size="160"
		/>

		<div class="username">
			{{ userProfile.username }}
			<RagequitIndicator :percentage="userProfile.gameStats.ragequitPercentage"/>
		</div>

		<div class="bio">
			{{ bio }}
		</div>

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
	import ChallengeButton from '@/components/ChallengeButton';

	export default {
		components: {
			UserAvatar,
			RagequitIndicator,
			ChallengeButton
		},
		props: {
			userProfile: Object,
			userSession: Object,
			userStatuses: Object
		},
		computed: {
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
		}
	};
</script>

<style lang="scss">
	.profile-tab {
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
</style>
