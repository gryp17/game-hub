<template>
	<div class="chat-controls">
		<FormInput
			v-model="message"
			@keypress.enter="onSubmit"
			placeholder="Write a message..."
			class="message-input"
			ref="messageInput"
			dark
		/>

		<div class="controls-wrapper">
			<EmojiPicker @select="addEmoji" />

			<FormButton
				@click="onSubmit"
				:disabled="submitting"
				transparent
				class="send-btn"
			>
				<i class="fas fa-paper-plane"></i>
				Send
			</FormButton>
		</div>
	</div>
</template>

<script>
	import EmojiPicker from '@/components/chat/EmojiPicker';

	export default {
		components: {
			EmojiPicker
		},
		data() {
			return {
				message: '',
				submitting: false
			};
		},
		computed: {

		},
		methods: {
			/**
			 * Adds an emoji to the textarea
			 * @param {Object} emoji
			 */
			addEmoji(emoji) {
				this.message = `${this.message}${emoji.native}`;
				//focus the message input once the emoticon has been added
				//...look at me mom - no jquery!
				this.$refs.messageInput.$el.querySelector('input').focus();
			},
			/**
			 * Submits the chat message
			 * @param {Object} e
			 */
			async onSubmit() {
				if (this.submitting) {
					return;
				}

				const message = this.message.trim();

				this.submitting = true;
				await this.$listeners['send-message'](message);
				this.message = '';
				this.submitting = false;
			}
		}
	};
</script>

<style lang="scss">
	.chat-controls {
		display: flex;
		padding: 5px 10px;
		background-color: $gray-dark;
		border-right: solid 1px $gray-darkest;

		.message-input {
			flex: 1;
			margin: 0px;
			font-size: 16px;

			textarea {
				resize: none;
			}
		}

		.controls-wrapper {
			margin-left: 5px;

			.form-button.transparent {
				&:hover {
					background-color: $gray;
				}
			}

			.send-btn {
				float: right;
			}
		}
	}
</style>
