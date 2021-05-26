import Vue from 'vue';
import VueRouter from 'vue-router';
import Authentication from '@/views/Authentication.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'authentication',
		component: Authentication
	},
	{
		path: '/lobby',
		name: 'lobby',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ '@/views/Lobby.vue')
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

export default router;
