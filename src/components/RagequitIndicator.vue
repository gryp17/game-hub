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
			showRagequitIcon() {
				return this.percentage >= 5;
			},
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
