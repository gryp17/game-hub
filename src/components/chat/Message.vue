<template>
	<div
		:class="['message', { own }]"
		@mouseover="onMouseOver"
		@mouseleave="onMouseLeave"
	>
		<div class="avatar-wrapper">
			<UserAvatar
				:avatar="message.user.avatarLink"
				:title="message.user.status.formatted"
				:status="message.user.status.avatar"
				:level="message.user.experience.level"
				:show-level="hover"
				@click="onOpenProfile"
			/>
		</div>
		<div class="message-wrapper">
			<div class="message-header">
				<ColoredUsername
					:username="username"
					:color="usernameColor"
					:ragequit-percentage="message.user.gameStats.ragequitPercentage"
					:title="username"
					@click="onOpenProfile"
				/>

				<MessageTimestamp
					alignment="left"
					:date="message.createdAt"
				/>
			</div>

			<div class="message-content">
				<div
					v-html="message.content"
					v-linkified:options="linkifiedOptions"
				/>
			</div>
		</div>
	</div>
</template>

<script>
	import UserAvatar from '@/components/UserAvatar';
	import ColoredUsername from '@/components/ColoredUsername';
	import MessageTimestamp from '@/components/chat/MessageTimestamp';

	export default {
		components: {
			UserAvatar,
			ColoredUsername,
			MessageTimestamp
		},
		props: {
			message: {
				type: Object,
				required: true
			},
			own: Boolean
		},
		data() {
			return {
				hover: false,
				linkifiedOptions: {
					className: 'linkified-link',
					attributes(href) {
						return {
							title: href
						};
					}
				}
			};
		},
		computed: {
			/**
			 * Returns the message author username
			 * @returns {String}
			 */
			username() {
				return this.message.user.username;
			},
			/**
			 * Returns the message author username color
			 * @returns {String}
			 */
			usernameColor() {
				return this.message.user.experience.color;
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
			},
			/**
			 * Emits the open-profile event with the message author id
			 */
			onOpenProfile() {
				this.$emit('open-profile', this.message.userId);
			}
		}
	};
</script>

<style lang="scss">
	.message {
		display: flex;
		padding: 10px 15px;

		&:hover {
			background-color: $gray-medium-dark;
		}

		.avatar-wrapper {
			text-align: center;

			.user-avatar {
				cursor: pointer;
			}
		}

		.message-wrapper {
			margin-left: 10px;
			flex: 1;

			.message-header {
				display: flex;

				.message-timestamp {
					margin-left: 5px;
				}
			}

			.message-content {
				margin-top: 3px;
				color: $text-color;
				word-break: break-word;
			}
		}
	}
</style>
