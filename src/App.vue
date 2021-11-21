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
	import experienceMap from '@/filters/experienceMap';
	import settingsLabelsMap from '@/filters/settingsLabelsMap';
	import keyCodesMap from '@/filters/keyCodesMap';
	import FormInput from '@/components/forms/FormInput';
	import FormFileInput from '@/components/forms/FormFileInput';
	import FormButton from '@/components/forms/FormButton';
	import FormSwitch from '@/components/forms/FormSwitch';
	import FormSelect from '@/components/forms/FormSelect';

	//global filters
	Vue.filter('errorsMap', errorsMap);
	Vue.filter('gamesMap', gamesMap);
	Vue.filter('experienceMap', experienceMap);
	Vue.filter('settingsLabelsMap', settingsLabelsMap);
	Vue.filter('keyCodesMap', keyCodesMap);

	//global components
	Vue.component('FormInput', FormInput);
	Vue.component('FormFileInput', FormFileInput);
	Vue.component('FormButton', FormButton);
	Vue.component('FormSwitch', FormSwitch);
	Vue.component('FormSelect', FormSelect);

	export default {
		data() {
			return {
				loading: true
			};
		},
		/**
		 * Fetches the application config before rendering the rest of the application views
		 */
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
	@import '~@/assets/css/_utils';
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

		//prevent the page refresh on scroll on mobile devices
		overscroll-behavior-y: contain;

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

		#app {
			display: flex;
			flex-direction: column;
			height: 100%;
		}
	}
</style>
