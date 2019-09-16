import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    routes: [
		{
			path: '/login',
			name: 'login',
			pathname: '登录',
			// redirect: '',// 重定向路由
			component: () => import('@/components/login/login.vue')
		},
		{
			path: '/',
			component: resolve => require(['../components/home.vue'], resolve)
		}
	],
	scrollBehavior (to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else {
			return {x: 0, y: 0};
		}
	}
});

router.beforeEach((to, from, next) => {
	// 权限判断，是否需要登录权限
	if (to.matched.some(res => res.meta.requireAuth)) {
		next();
	} else {
		next();
	}
	// 未匹配到路由
	if (to.matched.length === 0) {
		from.name ? next({name: from.name}) : next('/');
	} else {
		next();
	}
})

export default router