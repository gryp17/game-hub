<template>
	<div class="chart-legend">
		<div
			v-for="item in items"
			:key="item.legendLabel"
			class="legend-item"
		>
			<div
				class="item-color"
				:style="{
					backgroundColor: item.color
				}"
			></div>
			{{ item.legendLabel }}
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			items: Array
		}
	};
</script>

<style lang="scss">
	.chart-legend {
		display: flex;
		flex-direction: column;
		justify-content: center;

		.legend-item {
			display: flex;
			padding: 3px;
			margin-right: 3px;

			.item-color {
				margin-right: 5px;
				width: 20px;
				height: 20px;
				border-radius: 100%;
			}
		}
	}
</style>
