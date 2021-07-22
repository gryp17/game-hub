<template>
	<div class="generic-game-stats-chart">
		<div class="chart-title">
			{{ title }}
		</div>

		<div class="chart-wrapper">
			<DoughnutChart
				class="chart"
				:chart-data="chartData"
				:options="options"
			/>

			<ChartLegend :items="labels"/>
		</div>
	</div>
</template>

<script>
	import ChartLegend from '@/components/charts/ChartLegend';
	import DoughnutChart from '@/components/charts/DoughnutChart';

	export default {
		components: {
			ChartLegend,
			DoughnutChart
		},
		props: {
			title: {
				type: String,
				required: true
			},
			labels: {
				type: Array,
				required: true
			},
			chartData: {
				type: Object,
				required: true
			},
			options: {
				type: Object,
				required: true
			}
		}
	};
</script>

<style lang="scss">
	.generic-game-stats-chart {
		.chart-title {
			margin: 10px 0px;
			font-size: 18px;
			text-align: center;
		}

		.chart-wrapper {
			display: flex;
			justify-content: center;

			.chart {
				width: 100%;
				max-width: 220px;
			}

			.chart-legend {
				margin-left: 15px;
			}
		}

		@media (max-width: $extra-small) {
			.chart-wrapper {
				flex-direction: column;
				align-items: center;

				.chart {
					order: 2;
				}

				.chart-legend {
					flex-direction: row;
					margin: 5px 0px;
				}
			}
		}
	}
</style>
