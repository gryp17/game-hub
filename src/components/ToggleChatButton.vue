<template>
	<FormButton
		class="toggle-chat-button"
		:title="title"
		@click="toggleChat"
	>
		<DynamicIcon
			:icon="icon"
		/>
	</FormButton>
</template>

<script>
	import DynamicIcon from '@/components/DynamicIcon';

	export default {
		components: {
			DynamicIcon
		},
		props: {
			active: Boolean
		},
		computed: {
			/**
			 * Returns the current button icon
			 * @returns {String}
			 */
			icon() {
				return this.active ? 'fas fa-users' : 'far fa-comment-dots';
			},
			/**
			 * Returns the current button text
			 * @returns {String}
			 */
			title() {
				return this.active ? 'Show players list' : 'Show chat';
			}
		},
		methods: {
			/**
			 * Emits the toggle event with the active state
			 */
			toggleChat() {
				this.$emit('toggle', !this.active);
			}
		}
	};
</script>

<style scoped lang="scss">
	.toggle-chat-button {
		position: absolute;
		top: 15px;
		right: 20px;
		padding: 10px 13px;
		border-radius: 100%;
		font-size: 25px;
		z-index: 2;

		&::v-deep .dynamic-icon {
			svg {
				margin: 0px;
				width: 25px;
				height: 25px;
			}
		}
	}
</style>
