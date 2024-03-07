// Sidebar Routers
export const menus = {
	'message.general': [
		{
			action: 'zmdi-view-dashboard',
			title: '工具',
			active: true,
			items: [
				{ title: 'message.ecommerce',icon:'success', fontend_path:'/default/dashboard/ecommerce', path: '/default/dashboard/ecommerce', exact: true },
				{ title: 'message.webAnalytics', path: '/mini/dashboard/web-analytics', exact: true },
				{ title: 'message.magazine', path: '/horizontal/dashboard/magazine', exact: true },
				{ title: 'message.news', path: '/boxed-v2/dashboard/news', exact: true },
				{ title: 'message.agency', path: '/boxed/dashboard/agency', exact: true },
				{ title: 'message.saas', path: '/horizontal/dashboard/saas', exact: true }
			]
		},
		{
			action: 'zmdi-widgets',
			title: 'message.widgets',
			active: false,
			items: [
				{ title: 'message.user', path: '/widgets/user-widgets' },
				{ title: 'message.charts', path: '/widgets/chart-widgets' }
			]
		},
		{
			action: 'zmdi-shopping-cart',
			title: 'message.ecommerce',
			active: false,
			items: [
				{ title: 'message.shop', path: '/ecommerce/shop' },
				{ title: 'message.cart', path: '/ecommerce/cart' },
				{ title: 'message.checkout', path: '/ecommerce/checkout' },
				{ title: 'message.cards', path: '/ecommerce/cards' }
			]
		},
		{
			action: 'zmdi-file-plus',
			title: 'message.pages',
			active: false,
			items: [
				{ title: 'message.blog', path: '/pages/blog' },
				{ title: 'message.gallery', path: '/pages/gallery' },
				{ title: 'message.pricing1', path: '/pages/pricing-1' },
				{ title: 'message.pricing2', path: '/pages/pricing-2' },
				{ title: 'message.blank', path: '/pages/blank' }
			]
		},
		{
			action: 'zmdi-time',
			title: 'message.session1',
			active: false,
			items: [
				{ title: 'message.signUp', path: '/session/sign-up', exact: true },
				{ title: 'message.login', path: '/session/login', exact: true },
				{ title: 'message.lockScreen', path: '/session/lock-screen', exact: true },
				{ title: 'message.forgotPassword', path: '/session/forgot-password', exact: true },
				{ title: 'message.resetPassword', path: '/session/reset-password', exact: true }
			]
		},
		{
			action: 'zmdi-time',
			title: 'message.session2',
			active: false,
			items: [
				{ title: 'message.signUp', path: '/session/sign-up', exact: true },
				{ title: 'message.login', path: '/session/login', exact: true },
				{ title: 'message.lockScreen', path: '/session/lock-screen', exact: true },
				{ title: 'message.forgotPassword', path: '/session/forgot-password', exact: true },
				{ title: 'message.resetPassword', path: '/session/reset-password', exact: true }
			]
		},
		{
			action: 'zmdi-time',
			title: 'message.session3',
			active: false,
			items: [
				{ title: 'message.signUp', path: '/session/sign-up', exact: true },
				{ title: 'message.login', path: '/session/login', exact: true },
				{ title: 'message.lockScreen', path: '/session/lock-screen', exact: true },
				{ title: 'message.forgotPassword', path: '/session/forgot-password', exact: true },
				{ title: 'message.resetPassword', path: '/session/reset-password', exact: true }
			]
		}
	]
}
