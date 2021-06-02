<template>
	<div
		class="user-item"
		@click="$emit('click', user)"
	>
		{{ user.username }} ({{ user.status }})
	</div>
</template>

<script>
	export default {
		props: {
			user: {
				type: Object,
				required: true
			}
		},
		computed: {

		}
	};
</script>

<style lang="scss">
	.user-item {
		padding: 10px;
	}
</style>
