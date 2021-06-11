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
					@click="onEditProfile"
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
	import { mapActions } from 'vuex';
	import DropdownMenu from '@/components/DropdownMenu';

	export default {
		components: {
			DropdownMenu
		},
		methods: {
			...mapActions('auth', [
				'logout'
			]),
			/**
			 * Logs out the user
			 */
			async onLogout() {
				await this.logout();
				this.$router.push({
					name: 'authentication'
				});
			},
			/**
			 * Opens the edit profile modal
			 */
			onEditProfile() {
				this.$modal.show('edit-profile-modal');
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
