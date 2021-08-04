<template>
	<div
		class="level-indicator"
		:title="title"
	>
		<div class="level-label">
			Level
		</div>
		<div class="level">
			{{ this.level }}
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			level: Number,
			title: String
		}
	};
</script>

<style lang="scss" scoped>
	.level-indicator {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 100%;
		vertical-align: middle;
		border: solid 2px $purple;
		color: $white;
		background-color: $gray;
		font-weight: bold;

		.level-label {
			margin-top: 4px;
			font-size: 9px;
		}

		.level {
			font-size: 13px;
		}
	}
</style>
