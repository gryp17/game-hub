<template>
	<div class="pagination">
		<FormButton
			:disabled="currentPage === 0"
			@click="$emit('change-page', 0)"
			class="btn-arrow"
			title="First page"
		>
			<i class="fas fa-angle-double-left"></i>
		</FormButton>

		<FormButton
			:disabled="currentPage === 0"
			@click="$emit('change-page', currentPage - 1)"
			class="btn-arrow"
			title="Previous page"
		>
			<i class="fas fa-angle-left"></i>
		</FormButton>

		<FormButton
			v-for="page in pages"
			:key="page"
			:class="{active: currentPage === page}"
			@click="$emit('change-page', page)"
		>
			{{ page + 1 }}
		</FormButton>

		<FormButton
			:disabled="currentPage === totalPages - 1"
			@click="$emit('change-page', currentPage + 1)"
			class="btn-arrow"
			title="Next page"
		>
			<i class="fas fa-angle-right"></i>
		</FormButton>

		<FormButton
			:disabled="currentPage === totalPages - 1"
			@click="$emit('change-page', totalPages - 1)"
			class="btn-arrow"
			title="Last page"
		>
			<i class="fas fa-angle-double-right"></i>
		</FormButton>
	</div>
</template>

<script>
	export default {
		props: {
			totalPages: Number,
			currentPage: Number
		},
		data() {
			return {
				pages: []
			};
		},
		created() {
			this.calculatePages();
		},
		watch: {
			/**
			 * Watches all props and updates the pages
			 */
			$props: {
				handler() {
					this.calculatePages();
				},
				deep: true
			}
		},
		methods: {
			/**
			 * Calculates the page buttons that need to be displayed based on the currentPage and totalPages
			 */
			calculatePages() {
				const pages = [];
				let start = 0;
				let end = 0;

				if (this.currentPage === 0) {
					start = this.currentPage;
					end = Math.min(this.currentPage + 2, this.totalPages - 1);
				} else if (this.currentPage === this.totalPages - 1) {
					start = Math.max(this.currentPage - 2, 0);
					end = this.currentPage;
				} else {
					start = this.currentPage - 1;
					end = this.currentPage + 1;
				}

				for (let i = start; i <= end; i++) {
					pages.push(i);
				}

				this.pages = pages;
			}
		}
	};
</script>

<style scoped lang="scss">
	.pagination {
		justify-content: center;
		margin: 15px 0px;

		button {
			margin: 0px 1px;
			padding: 6px 12px;
			font-size: 15px;
			font-weight: bold;
			border-radius: 5px;

			&.btn-arrow {
				margin-top: -1px;
				font-size: 18px;
				padding: 0px 12px;
			}

			> svg {
				margin: -2px 0px 0px 0px;
			}
		}
	}
</style>
