<template>
	<div class="game-history-tab">
		<!-- TODO: show something if no games -->
		<GameHistoryItem
			v-for="game in games"
			:key="game.id"
			:game="game"
		/>

		<!-- TODO: fix the pagination styling -->
		<Pagination
			v-show="totalPages > 1"
			:total-pages="totalPages"
			:current-page="page"
			@change-page="getGames"
		/>
	</div>
</template>

<script>
	import GameHistoryItem from '@/components/GameHistoryItem';
	import Pagination from '@/components/Pagination';

	export default {
		components: {
			GameHistoryItem,
			Pagination
		},
		props: {
			total: Number,
			games: Array,
			gamesPerPage: Number
		},
		data() {
			return {
				page: 0
			};
		},
		computed: {
			totalPages() {
				return Math.ceil(this.total / this.gamesPerPage);
			}
		},
		methods: {
			getGames(page) {
				this.page = page;

				this.$emit('get-games', {
					limit: this.gamesPerPage,
					offset: page * this.gamesPerPage
				});
			}
		}
	};
</script>

<style lang="scss">
	.game-history-tab {

	}
</style>
