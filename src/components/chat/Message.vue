<template>
	<div :class="['message', { own }]">
		<div class="avatar-wrapper">
			<UserAvatar
				:avatar="message.user.avatarLink"
				:title="message.user.status.formatted"
				:status="message.user.status.avatar"
				@click="$emit('open-profile', message.userId)"
			/>
		</div>
		<div class="message-wrapper">
			<div class="message-header">
				<div :title="username" class="author">
					{{ username }}
				</div>

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
	import MessageTimestamp from '@/components/chat/MessageTimestamp';

	export default {
		components: {
			UserAvatar,
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
			username() {
				return this.message.user.username;
			}
		}
	};
</script>

<style lang="scss">
	.message {
		display: flex;
		padding: 10px 15px;

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

				.author {
					font-size: 16px;
					font-weight: bold;
					color: $blue;
					cursor: pointer;
				}

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

		&.own {
			.message-wrapper {
				.author {
					color: $pink;
				}
			}
		}
	}
</style>
