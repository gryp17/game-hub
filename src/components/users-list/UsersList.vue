<template>
	<div class="users-list">
		<UsersListItem
			v-for="user in users"
			:key="user.id"
			:user="user"
			:user-statuses="userStatuses"
			@click="$emit('open-profile', $event)"
		/>
	</div>
</template>

<script>
	import UsersListItem from '@/components/users-list/UsersListItem';

	export default {
		components: {
			UsersListItem
		},
		props: {
			users: Array,
			userStatuses: Object
		}
	};
</script>

<style lang="scss">
	.users-list {
		height: 100%;
		width: 250px;
		background-color: $gray-dark;
		overflow-y: auto;
	}
</style>
