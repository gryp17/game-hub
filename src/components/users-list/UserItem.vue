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
	const gameStatuses = ['pong', 'volley'];
	const onlineStateStatuses = ['online', 'offline'];

	export default {
		props: {
			user: {
				type: Object,
				required: true
			}
		},
		computed: {
			rawStatus() {
				return this.user.status;
			},
			status() {
				let status = this.rawStatus.charAt(0).toUpperCase() + this.rawStatus.slice(1);

				if (gameStatuses.includes(this.rawStatus)) {
					status = `Playing ${status}`;
				}

				return status;
			},
			avatarClass() {
				if (gameStatuses.includes(this.rawStatus)) {
					return 'busy';
				}

				return this.rawStatus;
			},
			showStatus() {
				return !onlineStateStatuses.includes(this.rawStatus);
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
			color: $gray-lightest;
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
