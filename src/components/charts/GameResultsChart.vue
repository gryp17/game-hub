<template>
	<div class="game-results-chart">
		<div class="chart-title">
			Games by result
		</div>
		<DoughnutChart
			class="doughnut-chart"
			:chart-data="chartData"
			:options="chartOptions"
		/>
	</div>
</template>

<script>
	import DoughnutChart from '@/components/charts/DoughnutChart';

	export default {
		components: {
			DoughnutChart
		},
		props: {
			won: Number,
			lost: Number,
			ragequit: Number
		},
		computed: {
			chartData() {
				//ragequit games also count as losses
				const won = this.won;
				const lost = this.lost - this.ragequit;
				const ragequit = this.ragequit;

				return {
					labels: [`Won: ${won}`, `Lost: ${lost}`, `Ragequit: ${ragequit}`],
					datasets: [
						{
							label: 'Games',
							data: [
								won,
								lost,
								ragequit
							],
							backgroundColor: ['#43b581', '#ff5e59', '#ff88de']
						}
					]
				};
			},
			chartOptions() {
				return {
					tooltips: {
						callbacks: {
							//remove the duplicate value from the tooptip (ex: Won: 23: 23)
							label(tooltipItem, data) {
								const label = data.labels[tooltipItem.index];
								return label;
							}
						}
					}
				};
			}
		}
	};
</script>

<style lang="scss">
	.game-results-chart {
		.chart-title {
			font-size: 18px;
			text-align: center;
		}
	}
</style>
