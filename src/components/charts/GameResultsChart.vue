<template>
	<div class="game-results-chart">
		<GenericGameStatsChart
			title="Games by result"
			:labels="labels"
			:chart-data="chartData"
			:options="chartOptions"
		/>
	</div>
</template>

<script>
	import GenericGameStatsChart from '@/components/charts/GenericGameStatsChart';

	export default {
		components: {
			GenericGameStatsChart
		},
		props: {
			won: Number,
			lost: Number,
			ragequit: Number
		},
		computed: {
			/**
			 * Puts all the statistics in a single object and calculates the actual lost games
			 * @returns {Object}
			 */
			stats() {
				//ragequit games also count as losses
				return {
					won: this.won,
					lost: this.lost - this.ragequit,
					ragequit: this.ragequit
				};
			},
			/**
			 * Returns the list of chart labels with their corresponding colors
			 * @returns {Array}
			 */
			labels() {
				return [
					{
						label: 'Won',
						legendLabel: `Won: ${this.stats.won}`,
						color: '#43b581'
					},
					{
						label: 'Lost',
						legendLabel: `Lost: ${this.stats.lost}`,
						color: '#ff5e59'
					},
					{
						label: 'Ragequit',
						legendLabel: `Ragequit: ${this.stats.ragequit}`,
						color: '#ff88de'
					}
				];
			},
			/**
			 * Returns the formated chart data and labels configuration
			 * @returns {Object}
			 */
			chartData() {
				const labels = [];
				const colors = [];

				this.labels.forEach((item) => {
					labels.push(item.label);
					colors.push(item.color);
				});

				return {
					labels,
					datasets: [
						{
							label: 'Games',
							data: Object.values(this.stats),
							backgroundColor: colors
						}
					]
				};
			},
			/**
			 * Returns the additional chart options
			 * @returns {Object}
			 */
			chartOptions() {
				return {
					legend: {
						display: false
					}
				};
			}
		}
	};
</script>
