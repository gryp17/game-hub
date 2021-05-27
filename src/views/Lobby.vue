<template>
	<div class="lobby-page">
		<LoadingIndicator
			v-if="loading"
			full-screen
		/>
		<template v-else>
			<div class="header">
				<div class="column">

				</div>
				<div class="column">
					<img
						alt="logo"
						class="logo"
						title="GameHub"
						src="@/assets/img/logo-white.png"
					/>
				</div>
				<div class="column">
					<!-- user menu goes here -->
				</div>
			</div>
			<div class="content-wrapper">
				<div class="chat-wrapper">
					<div class="messages-list">
						<div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div>
						<div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div>
						<div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div><div>message</div>
						<div>message</div><div>message</div><div>message</div><div>message</div><div>message</div>
						<div>message</div><div>message</div><div>message</div><div>message</div><div>message</div>
					</div>
					<div class="controls">
						controls
					</div>
				</div>
				<div class="users-list">
					<div v-for="user in users" :key="user.id">
						{{ user.username }}
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';
	import LoadingIndicator from '@/components/LoadingIndicator';

	export default {
		components: {
			LoadingIndicator
		},
		data() {
			return {
				loading: true
			};
		},
		computed: {
			...mapGetters('lobby', [
				'users'
			])
		},
		async created() {
			await this.getUsers();
			this.loading = false;
		},
		methods: {
			...mapActions('lobby', [
				'getUsers'
			])
		}
	};
</script>

<style lang="scss">
	$header-height: 48px;

	.lobby-page {
		height: 100%;

		.header {
			display: flex;
			height: $header-height;
			padding: 15px;
			background-color: $gray-darkest;

			.column {
				flex: 1;
			}

			.logo {
				display: block;
				margin: auto;
				margin-top: -10px;
				width: 115px;
			}
		}

		.content-wrapper {
			display: flex;
			flex: 1;
			height: calc(100% - #{$header-height});

			.chat-wrapper {
				display: flex;
				flex-direction: column;
				flex: 1;
				background-color: $gray;

				.messages-list {
					display: flex;
					flex-direction: column-reverse;
					overflow-y: auto;

					> div {
						padding: 10px;
					}
				}

				.controls {
					padding: 20px 15px;
					background-color: $gray-dark;
					border-right: solid 1px $gray-darkest;
				}
			}

			.users-list {
				height: 100%;
				width: 250px;
				background-color: $gray-dark;
				overflow-y: auto;

				> div {
					padding: 10px;
				}
			}
		}
	}
</style>
