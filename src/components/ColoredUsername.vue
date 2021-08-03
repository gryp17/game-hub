<template>
	<div
		class="colored-username"
		:title="title"
		:style="{
			color
		}"
		@click="$emit('click')"
	>
		{{ username }}
		<RagequitIndicator :percentage="ragequitPercentage"/>
	</div>
</template>

<script>
	import RagequitIndicator from '@/components/RagequitIndicator';

	export default {
		components: {
			RagequitIndicator
		},
		props: {
			username: String,
			color: String,
			ragequitPercentage: Number,
			title: String
		}
	};
</script>

<style lang="scss">
	.colored-username {
		font-size: 16px;
		font-weight: bold;
		cursor: pointer;
		text-overflow: ellipsis;
		overflow-x: hidden;
		white-space: nowrap;
	}
</style>
