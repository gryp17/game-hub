<template>
	<div class="game-history-tab">
		<div v-if="total === 0" class="no-data">
			There is no data
		</div>
		<template v-else>
			<GameHistoryItem
				v-for="game in games"
				:key="game.id"
				:game="game"
				:user-profile="userProfile"
			/>

			<Pagination
				v-show="totalPages > 1"
				:total-pages="totalPages"
				:current-page="page"
				@change-page="getGames"
			/>
		</template>
	</div>
</template>

<script>
	import GameHistoryItem from '@/components/modals/user-profile/GameHistoryItem';
	import Pagination from '@/components/Pagination';

	export default {
		components: {
			GameHistoryItem,
			Pagination
		},
		props: {
			total: Number,
			games: Array,
			gamesPerPage: Number,
			userProfile: Object
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
		.no-data {
			padding: 50px 20px;
			text-align: center;
			font-size: 18px;
		}
	}
</style>
