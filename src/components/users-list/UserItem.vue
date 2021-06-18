<template>
	<div
		class="user-item"
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
	import { mapState } from 'vuex';
	import UserAvatar from '@/components/UserAvatar';

	export default {
		components: {
			UserAvatar
		},
		props: {
			user: {
				type: Object,
				required: true
			}
		},
		computed: {
			...mapState('config', [
				'userStatuses'
			]),
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
	.user-item {
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
