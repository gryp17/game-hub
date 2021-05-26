<template>
	<div class="authentication-page">
		<img
			alt="logo"
			class="logo"
			title="GameHub"
			src="@/assets/img/logo-white.png"
		/>

		<div class="tabs-wrapper">
			<Tabs cache-lifetime="0" :options="{ useUrlFragment: false }">
				<Tab name="Login">
					login form
				</Tab>
				<Tab name="Sign Up">
					signup form
				</Tab>
			</Tabs>
		</div>
	</div>
</template>

<script>
	import { Tabs, Tab } from 'vue-tabs-component';

	export default {
		components: {
			Tabs,
			Tab
		}
	};
</script>

<style lang="scss">
	.authentication-page {
		.logo {
			display: block;
			margin: auto;
			margin-top: 30px;
			width: 350px;
		}

		.tabs-wrapper {
			margin: auto;
			margin-top: 30px;
			width: 70%;
			max-width: 500px;
		}

		@media (max-width: $small) {
			.logo {
				width: 60%;
			}

			.tabs-wrapper {
				padding: 0px 10px;
				width: 100%;
			}
		}
	}
</style>
