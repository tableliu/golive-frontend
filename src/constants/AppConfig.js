/**
 * App Config File
 */
export default {
	appName: '现场协作平台',
	appNameOfAdmin: '现场协作平台(系统管理)',
	appLogo: '/static/logo.png',                                   // App Logo,
	darkLogo: '/static/logo-dark.png',							   		   // dark logo
	appLogo2: '/static/logo-full.png',                                   // App Logo 2 For Login & Signup Page
	brand: 'Qualisafe',                                        			        // Brand Name
	copyrightText: 'Qualisafe © 2019 All Rights Reserved.',                     // Copyright Text
	enableUserTour: process.env.NODE_ENV === 'production' ? true : false,   // Enable User Tour
	weatherApiId: 'b1b15e88fa797225412429c1c50c122a1',						// weather API Id
	weatherApiKey: '69b72ed255ce5efad910bd946685883a'						// weather APi key
}
