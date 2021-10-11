<template>
	<div
		class="level-label"
		:title="title"
		:style="{
			backgroundColor: color
		}"
	>
		Level {{ level }}
	</div>
</template>

<script>
	export default {
		props: {
			level: Number,
			color: String
		},
		computed: {
			/**
			 * Returns the level label
			 * @returns {String}
			 */
			title() {
				return `Level ${this.level}`;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.level-label {
		display: inline-block;
		margin: 0px 5px;
		padding: 3px;
		border-radius: 5px;
		color: white;
		font-size: 14px;
		font-weight: bold;
		text-shadow: 0 0 2px $black;
	}
</style>
