<template>
	<div class="emoji-picker">
		<FormButton
			transparent
			title="Add emoticon"
			class="emoticons-btn"
			:active="opened"
			@click="togglePicker"
		>
			<i class="fas fa-smile"></i>
		</FormButton>

		<Picker
			v-show="opened"
			:native="true"
			@select="onSelectEmoji"
			title="Pick an emoji"
			color="#0e9dec"
			ref="picker"
		/>
	</div>
</template>

<script>
	import { Picker } from 'emoji-mart-vue';

	export default {
		components: {
			Picker
		},
		data() {
			return {
				opened: false
			};
		},
		mounted() {
			document.addEventListener('click', this.handleOutsideClick);
		},
		destroyed() {
			document.removeEventListener('click', this.handleOutsideClick);
		},
		methods: {
			/**
			 * Closes the picker when a click is made outside of the component
			 * @param {Object} e
			 */
			handleOutsideClick(e) {
				const picker = this.$refs.picker.$el;
				const isClickInside = picker.contains(e.target);

				if (!isClickInside) {
					this.closePicker();
				}
			},
			/**
			 * Toggles the picker
			 * @param {Object} e
			 */
			togglePicker(e) {
				e.stopPropagation();
				this.opened = !this.opened;
			},
			/**
			 * Closes the picker
			 */
			closePicker() {
				this.opened = false;
			},
			/**
			 * Emits the select event with the selected emoji
			 * @param {Object} emoji
			 */
			onSelectEmoji(emoji) {
				this.$emit('select', emoji);
				this.closePicker();
			}
		}
	};
</script>

<style lang="scss">
	.emoji-picker {
		position: relative;
		display: inline-block;

		.form-button.emoticons-btn {
			color: $yellow;
		}

		.emoji-mart {
			position: absolute;
			left: 0;
			bottom: 40px;
		}
	}
</style>
