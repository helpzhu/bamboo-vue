import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/layout'

Vue.use(Router)

const router = new Router({
	routes: [
		{
			path: '/login',
			component: () => import('@/views/login/index'),
			hidden: true
		},

		{
			path: '/404',
			component: () => import('@/views/404'),
			hidden: true
		},

		{
			path: '/',
			component: Layout,
			redirect: '/dashboard',
			children: [{
				path: 'dashboard',
				name: 'Dashboard',
				component: () => import('@/views/dashboard/index'),
				meta: { title: 'Dashboard', icon: 'dashboard', requireAuth: true }
			}]
		},

		{
			path: 'external-link',
			component: Layout,
			children: [
				{
					path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
					meta: { title: 'External Link', icon: 'link' }
				}
			]
		},
		{
			path: '',
			name: 'systemManage',
			meta: { title: '系统管理', icon: 'setting' },
			component: Layout,
			children: [
				{
					path: '/user/userList',
					name: 'userList',
					component: () => import('@/views/user/userList'),
					meta: { title: '用户列表', icon: 'user'}
				},
				{
					path: '/role/roleList',
					name: 'roleList',
					component: () => import('@/views/role/roleList'),
					meta: { title: '角色列表', icon: 'dashboard'}
				},
				{
					path: '/menu/menuList',
					name: 'menuList',
					component: () => import('@/views/menu/menuList'),
					meta: { title: '菜单列表', icon: 'dashboard'}
				}
			]
		},
		// 404 page must be placed at the end !!!
		{ path: '*', redirect: '/404', hidden: true }
	],
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else {
			return { x: 0, y: 0 };
		}
	}
});

function routerMenu(menuList) {
	menuList.forEach(menu => {
		let routerChildren = [];
		for (let i = 0; i < menu.selfMenuVoList.length; i++) {
			const selfMenuVo = menu.selfMenuVoList[i];
			let children = {
				path: selfMenuVo.menuUrl,
				name: selfMenuVo.menuName,
				component: resolve => require([`@/views` + selfMenuVo.menuUrl + `.vue`], resolve),
				meta: { title: selfMenuVo.menuName, icon: selfMenuVo.menuIcon }
			}
			routerChildren.push(children);
		}
		router.options.routes.push({
			path: menu.menuUrl,
			name: menu.menuName,
			component: Layout,
			meta: { title: menu.menuName, icon: menu.menuIcon, requireAuth: true },
			children: routerChildren
		})
	});
}

if (localStorage.getItem('menuTree')) {
	routerMenu(JSON.parse(localStorage.getItem('menuTree')));
	router.addRoutes(router.options.routes)
}

router.beforeEach((to, from, next) => {
	// 权限判断，是否需要登录权限
	if (to.matched.some(res => res.meta.requireAuth)) {
		//next();
		if (window.sessionStorage.getItem('curUserInfo')) {
			next();
		} else {
			// 暂时注释，连接后台时需放开
			/* next({
				path: '/login',
				query: {redirect: to.fullPath}
			}) */
			next();
			window.localStorage.removeItem('menuTree');
			window.sessionStorage.removeItem('curUserInfo');
		}
	} else {
		next();
	}
	// 未匹配到路由
	if (to.matched.length === 0) {
		from.name ? next({ name: from.name }) : next('/');
	} else {
		next();
	}
})

export default router