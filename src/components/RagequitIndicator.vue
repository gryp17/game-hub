<template>
	<i
		v-if="showRagequitIcon" class="ragequit-indicator fas fa-poo"
		:title="ragequitTitle"
	></i>
</template>

<script>
	export default {
		props: {
			percentage: {
				type: Number,
				default: 0
			}
		},
		computed: {
			/**
			 * Indicates whether the ragequit icon should be displayed
			 * @returns {Boolean}
			 */
			showRagequitIcon() {
				return this.percentage >= 5;
			},
			/**
			 * Returns the ragequit title text
			 * @returns {String}
			 */
			ragequitTitle() {
				return `${this.percentage}% ragequit rate`;
			}
		}
	};
</script>

<style lang="scss">
	.ragequit-indicator {
		color: $brown;
	}
</style>
