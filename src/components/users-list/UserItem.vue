<template>
	<div
		class="user-item"
		@click="$emit('click', user)"
	>
		<div :class="['avatar-wrapper', avatarClass]">
			<img
				:src="user.avatarLink"
				:title="status"
			/>
		</div>
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
				:title="status"
			>
				{{ status }}
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState } from 'vuex';

	export default {
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
			gameStatuses() {
				return [
					this.userStatuses.PONG
				];
			},
			onlineStateStatuses() {
				return [
					this.userStatuses.ONLINE,
					this.userStatuses.OFFLINE
				];
			},
			rawStatus() {
				return this.user.status;
			},
			status() {
				let status = this.rawStatus.charAt(0).toUpperCase() + this.rawStatus.slice(1);

				if (this.gameStatuses.includes(this.rawStatus)) {
					status = `Playing ${status}`;
				}

				return status;
			},
			avatarClass() {
				if (this.gameStatuses.includes(this.rawStatus)) {
					return 'busy';
				}

				return this.rawStatus;
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

		.avatar-wrapper {
			position: relative;

			img {
				width: 40px;
				height: 40px;
				border-radius: 100%;
				vertical-align: middle;
			}

			&:after {
				position: absolute;
				bottom: -2px;
				right: -2px;
				content: '';
				width: 15px;
				height: 15px;
				background-color: $gray-light;
				border: solid 2px $gray;
				border-radius: 100%;
				pointer-events: none;
			}

			&.online {
				&:after {
					background-color: $green;
				}
			}

			&.offline {
				&:after {
					background-color: $gray-light;
				}
			}

			&.busy, &.matchmaking {
				&:after {
					background-color: $red;
				}
			}
		}

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
