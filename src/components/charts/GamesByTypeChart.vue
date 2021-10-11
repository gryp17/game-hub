<template>
	<div class="games-by-type-chart">
		<GenericGameStatsChart
			title="Games by type"
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
			games: Object
		},
		computed: {
			/**
			 * Contains the list of chart labels with their corresponding colors
			 * @returns {Array}
			 */
			labels() {
				const colors = ['#7289da', '#ffa78b', '#ff88de'];
				const labels = [];

				Object.keys(this.games).forEach((gameCode, index) => {
					const game = this.$options.filters.gamesMap(gameCode);
					const value = this.games[gameCode];
					const legendLabel = `${game.label}: ${value}`;

					labels.push({
						label: game.label,
						legendLabel,
						color: colors[index]
					});
				});

				return labels;
			},
			/**
			 * Contains the formated chart data and labels configuration
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
							data: Object.values(this.games),
							backgroundColor: colors
						}
					]
				};
			},
			/**
			 * Contains additional chart options
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
