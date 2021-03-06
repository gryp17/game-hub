<template>
	<div
		class="users-list-item"
		@click="$emit('click', user)"
		@mouseover="onMouseOver"
		@mouseleave="onMouseLeave"
	>
		<UserAvatar
			:avatar="user.avatarLink"
			:title="formattedStatus"
			:status="avatarStatus"
			:level="user.experience.level"
			:show-level="hover"
		/>
		<div class="user-info">
			<ColoredUsername
				:username="user.username"
				:color="user.experience.color"
				:ragequit-percentage="user.gameStats.ragequitPercentage"
				:title="user.username"
			/>
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
	import ColoredUsername from '@/components/ColoredUsername';

	export default {
		components: {
			UserAvatar,
			ColoredUsername
		},
		props: {
			user: {
				type: Object,
				required: true
			},
			userStatuses: Object
		},
		data() {
			return {
				hover: false
			};
		},
		computed: {
			/**
			 * Returns the list of statuses that indicate whether the user is online or offline
			 * @returns {Array}
			 */
			onlineStateStatuses() {
				return [
					this.userStatuses.online,
					this.userStatuses.offline
				];
			},
			/**
			 * Returns the user's raw status
			 * @returns {String}
			 */
			rawStatus() {
				return this.user.status.raw;
			},
			/**
			 * Returns the user's formatted status
			 * @returns {String}
			 */
			formattedStatus() {
				return this.user.status.formatted;
			},
			/**
			 * Returns the user's avatar status
			 * @returns {String}
			 */
			avatarStatus() {
				return this.user.status.avatar;
			},
			/**
			 * Indicates whether the text status should be displayed
			 * @returns {Boolean}
			 */
			showStatus() {
				return !this.onlineStateStatuses.includes(this.rawStatus);
			}
		},
		methods: {
			/**
			 * Mouseover event handler
			 */
			onMouseOver() {
				this.hover = true;
			},
			/**
			 * Mouseleave event handler
			 */
			onMouseLeave() {
				this.hover = false;
			}
		}
	};
</script>

<style lang="scss">
	.users-list-item {
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
