import Vue from 'vue';
import Toasted from 'vue-toasted';
import VModal from 'vue-js-modal';
import Linkify from 'vue-linkify';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(Toasted, {
	position: 'bottom-center',
	duration: 3000,
	keepOnHover: true,
	iconPack: 'fontawesome'
});

//register custom toast type
Vue.toasted.register('apiError', (payload) => {
	return payload.message || 'Error';
}, {
	type: 'error',
	icon: {
		name: 'fa-exclamation-triangle'
	},
	action: [
		{
			icon: 'fa-times',
			onClick: (e, toast) => {
				toast.goAway(0);
			}
		}
	]
});

Vue.use(VModal);
Vue.directive('linkified', Linkify);

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: (h) => h(App)
}).$mount('#app');
