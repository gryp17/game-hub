<template>
	<div id="app">
		<router-view v-if="!loading" />
	</div>
</template>

<script>
	import Vue from 'vue';
	import { mapActions } from 'vuex';

	import errorsMap from '@/filters/errorsMap';
	import gamesMap from '@/filters/gamesMap';
	import FormInput from '@/components/forms/FormInput';
	import FormFileInput from '@/components/forms/FormFileInput';
	import FormButton from '@/components/forms/FormButton';
	import FormSwitch from '@/components/forms/FormSwitch';

	//global filters
	Vue.filter('errorsMap', errorsMap);
	Vue.filter('gamesMap', gamesMap);

	//global components
	Vue.component('FormInput', FormInput);
	Vue.component('FormFileInput', FormFileInput);
	Vue.component('FormButton', FormButton);
	Vue.component('FormSwitch', FormSwitch);

	export default {
		data() {
			return {
				loading: true
			};
		},
		async created() {
			await this.getConfig();
			this.loading = false;
		},
		methods: {
			...mapActions('config', [
				'getConfig'
			])
		}
	};
</script>

<style lang="scss">
	@import '~@/assets/css/_vue-tabs';
	@import '~@/assets/css/_vue-toasted';
	@import '~@/assets/css/_vue-modal';

	*,
	:after,
	:before {
		box-sizing:border-box;
	}

	body, html {
		margin: 0;
		padding: 0;
		height: 100%;
	}

	body {
		background-color: $background;
		font-family:  $font-family;
		color: $text-color;

		:focus {
			outline: none;
		}

		::-moz-focus-inner {
			border: 0;
		}

		input {
			filter: none;
		}

		button:focus {
			outline: none;
		}

		a {
			color: $purple;
		}

		.bold {
			font-weight: bold;
		}

		#app {
			display: flex;
			flex-direction: column;
			height: 100%;
		}
	}
</style>
