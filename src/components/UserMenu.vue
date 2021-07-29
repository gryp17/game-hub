<template>
	<div class="user-menu">
		<DropdownMenu>
			<template v-slot:button>
				<FormButton
					transparent
					title="Open user menu"
					class="menu-btn"
				>
					<i class="fas fa-bars"></i>
				</FormButton>
			</template>
			<template v-slot:items>
				<div
					@click="$emit('edit-profile')"
				>
					<i class="fas fa-user-edit"></i>
					Edit Profile
				</div>
				<div
					@click="onLogout"
				>
					<i class="fas fa-sign-out-alt"></i>
					Logout
				</div>
			</template>
		</DropdownMenu>
	</div>
</template>

<script>
	import DropdownMenu from '@/components/DropdownMenu';

	export default {
		components: {
			DropdownMenu
		},
		methods: {
			/**
			 * Logs out the user
			 */
			async onLogout() {
				//use $listeners instead of $emit in order to be able to await the response
				await this.$listeners.logout();
				this.$router.push({
					name: 'authentication'
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.user-menu {
		::v-deep .menu-btn {
			color: $white;

			&:hover {
				background-color: $gray-dark;
			}
		}
	}
</style>
