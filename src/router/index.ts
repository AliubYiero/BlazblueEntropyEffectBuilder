/**
 * index.ts
 * created by 2024/4/13
 * @file router
 * @author  Yiero
 * */

import { createRouter, createWebHashHistory } from 'vue-router';


export const router = createRouter( {
	// 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			component: () => import('../views/SearchDoublePage.vue'),
		},
		{
			path: '/builder',
			component: () => import('../views/SectBuilderPage.vue'),
		},
	],
} );
