<script>
	import { Doughnut, mixins } from 'vue-chartjs';

	const { reactiveProp } = mixins;

	export default {
		extends: Doughnut,
		mixins: [reactiveProp],
		props: {
			chartData: Object,
			options: Object
		},
		/**
		 * Renders the chartjs chart once the component is mounted
		 */
		mounted() {
			this.renderChart(this.chartData, this.options);
		}
	};
</script>
