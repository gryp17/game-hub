<template>
	<div class="game-history-tab">
		<NoData v-if="total === 0" />
		<template v-else>
			<GameHistoryItem
				v-for="game in games"
				:key="game.id"
				:game="game"
				:user-profile="userProfile"
				@open-profile="$emit('open-profile', $event)"
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
	import NoData from '@/components/modals/user-profile/NoData';

	export default {
		components: {
			GameHistoryItem,
			Pagination,
			NoData
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
		watch: {
			userProfile: {
				/**
				 * Watches the userProfile and resets the opened pagination page
				 */
				handler() {
					this.page = 0;
				},
				deep: true
			}
		},
		computed: {
			/**
			 * Returns the total pages
			 * @returns {Number}
			 */
			totalPages() {
				return Math.ceil(this.total / this.gamesPerPage);
			}
		},
		methods: {
			/**
			 * Fetches the games items that match the provided limit and offset
			 * @param {Number} page
			 */
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
