<template>
	<div
		class="user-list-item"
		@click="$emit('click', user)"
	>
		<UserAvatar
			:avatar="user.avatarLink"
			:title="formattedStatus"
			:status="avatarStatus"
		/>
		<div class="user-info">
			<div
				class="username"
				:title="user.username"
			>
				{{ user.username }}
				<RagequitIndicator :percentage="user.gameStats.ragequitPercentage"/>
			</div>
			<div
				v-if="showStatus"
				class="status"
				:title="formattedStatus"
			>
				{{ formattedStatus }}
			</div>
		</div>
	</div>
</template>

<script>
	import UserAvatar from '@/components/UserAvatar';
	import RagequitIndicator from '@/components/RagequitIndicator';

	export default {
		components: {
			UserAvatar,
			RagequitIndicator
		},
		props: {
			user: {
				type: Object,
				required: true
			},
			userStatuses: Object
		},
		computed: {
			onlineStateStatuses() {
				return [
					this.userStatuses.ONLINE,
					this.userStatuses.OFFLINE
				];
			},
			rawStatus() {
				return this.user.status.raw;
			},
			formattedStatus() {
				return this.user.status.formatted;
			},
			avatarStatus() {
				return this.user.status.avatar;
			},
			showStatus() {
				return !this.onlineStateStatuses.includes(this.rawStatus);
			}
		}
	};
</script>

<style lang="scss">
	.user-list-item {
		display: flex;
		padding: 10px;
		cursor: pointer;

		.user-info {
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding-left: 10px;
			color: $gray-very-light;
			overflow-x: hidden;

			.username {
				text-overflow: ellipsis;
				overflow-x: hidden;
				white-space: nowrap;
			}

			.status {
				font-size: 14px;
			}
		}

		&:hover {
			background-color: $gray;

			.user-info {
				color: $white;
			}
		}
	}
</style>
