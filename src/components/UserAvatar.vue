<template>
	<div :class="['user-avatar', avatarClass, statusType]">
		<img
			class="avatar-image"
			:src="avatar"
			:title="title"
			:style="avatarStyle"
		/>
	</div>
</template>

<script>
	export default {
		props: {
			avatar: {
				type: String,
				required: true
			},
			title: String,
			status: String,
			statusType: {
				type: String,
				default: 'circle',
				validator(value) {
					return ['circle', 'border'].indexOf(value) !== -1;
				}
			},
			size: {
				type: Number,
				default: 40
			}
		},
		computed: {
			avatarClass() {
				return this.status ? `show-status ${this.status}` : null;
			},
			avatarStyle() {
				return {
					width: `${this.size}px`,
					height: `${this.size}px`
				};
			}
		}
	};
</script>

<style scoped lang="scss">
	$magic-ratio: 0.375;

	.user-avatar {
		position: relative;
		display: inline-block;

		.avatar-image {
			border-radius: 100%;
			vertical-align: middle;
		}

		&.show-status {

			//circle status type
			&.circle {
				&:after {
					position: absolute;
					bottom: -2px;
					right: -2px;
					content: '';
					width: 15px;
					height: 15px;
					width: calc(100% * #{$magic-ratio});
					height: calc(100% * #{$magic-ratio});
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

			//border status type
			&.border {
				.avatar-image {
					border: solid 4px $gray-light;
				}

				&.online {
					.avatar-image {
						border-color: $green;
					}
				}

				&.offline {
					.avatar-image {
						border-color: $gray-light;
					}
				}

				&.busy, &.matchmaking {
					.avatar-image {
						border-color: $red;
					}
				}
			}
		}
	}
</style>
