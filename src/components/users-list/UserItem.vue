<template>
	<div
		class="user-item"
		@click="$emit('click', user.id)"
	>
		{{ user.username }}
	</div>
</template>

<script>
	export default {
		props: {
			user: {
				type: Object,
				required: true
			}
		}
	};
</script>

<style lang="scss">
	.user-item {
		padding: 10px;
	}
</style>
