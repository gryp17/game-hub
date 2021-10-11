<template>
	<div class="messages-list" ref="list">
		<Message
			v-for="message in messages"
			:key="message.id"
			:message="message"
			:own="message.userId === userSession.id"
			@open-profile="$emit('open-profile', $event)"
		/>
	</div>
</template>

<script>
	import Message from '@/components/chat/Message';

	export default {
		components: {
			Message
		},
		props: {
			messages: Array,
			userSession: Object
		},
		data() {
			return {
				limit: 15,
				fetchMessagesTimeout: null
			};
		},
		computed: {
			/**
			 * Returns the pagination offset
			 * @returns {Number}
			 */
			offset() {
				return this.messages.length;
			}
		},
		/**
		 * Adds the scroll event listener
		 */
		mounted() {
			this.$refs.list.addEventListener('scroll', this.onChatScroll);
		},
		/**
		 * Removes the scroll event listener
		 */
		beforeDestroy() {
			this.$refs.list.removeEventListener('scroll', this.onChatScroll);
		},
		watch: {
			messages: {
				/**
				 * Watches the messages list and scrolls to the bottom when a new message arrives
				 * @param {Array} newMessages
				 * @param {Array} oldMessages
				 */
				handler(newMessages, oldMessages) {
					//scroll to the bottom only when a new message arrives
					if (!oldMessages || (
						newMessages.length > 0 && oldMessages.length > 0 && newMessages[0].id !== oldMessages[0].id)
					) {
						this.$nextTick(() => {
							this.scrollToBottom();
						});
					}
				},
				deep: true
			}
		},
		methods: {
			/**
			 * Scrolls the chat to the bottom
			 */
			scrollToBottom() {
				const list = this.$refs.list;
				list.scrollTop = list.scrollHeight;
			},
			/**
			 * Fetches more messages on scroll
			 * @param {Object} e
			 */
			onChatScroll(e) {
				//hackfix for the flex-direction reverse-column negative scrollTop bug
				const scrollPosition = (e.target.scrollHeight + e.target.scrollTop) - e.target.clientHeight;
				if (scrollPosition < 50) {
					this.fetchOlderMessages();
				}
			},
			/**
			 * Fetches more/older message
			 */
			async fetchOlderMessages() {
				if (this.fetchMessagesTimeout) {
					clearTimeout(this.fetchMessagesTimeout);
				}

				this.fetchMessagesTimeout = setTimeout(() => {
					const params = {
						limit: this.limit,
						offset: this.offset
					};

					this.$emit('get-messages', params);
				}, 500);
			}
		}
	};
</script>

<style scoped lang="scss">
	.messages-list {
		flex: 1;
		display: flex;
		flex-direction: column-reverse;
		overflow-y: auto;
	}
</style>
