import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import Authentication from '@/views/Authentication.vue';

Vue.use(VueRouter);

/**
 * Checks if the user is logged in
 * @returns {Boolean}
 */
async function userIsAuthenticated() {
	await store.dispatch('auth/getUserSession');
	return store.getters['auth/isLoggedIn'];
}

/**
 * Route guard that redirects to the login page if the user is not authenticated
 * @param {Object} to
 * @param {Object} from
 * @param {Function} next
 */
async function mustBeLoggedIn(to, from, next) {
	const loggedIn = await userIsAuthenticated();

	if (loggedIn) {
		next();
	} else {
		next({
			name: 'authentication'
		});
	}
}

/**
 * Route guard that redirects to the lobby page if the user is already authenticated
 * @param {Object} to
 * @param {Object} from
 * @param {Function} next
 */
async function alreadyLoggedIn(to, from, next) {
	const loggedIn = await userIsAuthenticated();

	if (loggedIn) {
		next({
			name: 'lobby'
		});
	} else {
		next();
	}
}

const routes = [
	{
		path: '/',
		name: 'authentication',
		component: Authentication,
		beforeEnter: alreadyLoggedIn
	},
	{
		path: '/lobby',
		name: 'lobby',
		// route level code-splitting
		// this generates a separate chunk (lobby.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "lobby" */ '@/views/Lobby.vue'),
		beforeEnter: mustBeLoggedIn
	},
	{
		path: '/pong',
		name: 'pong',
		component: () => import(/* webpackChunkName: "pong" */ '@/views/Pong.vue'),
		beforeEnter: mustBeLoggedIn
	},
	{
		path: '/volley',
		name: 'volley',
		component: () => import(/* webpackChunkName: "volley" */ '@/views/Volley.vue'),
		beforeEnter: mustBeLoggedIn
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

export default router;
