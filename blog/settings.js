/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

module.exports = {
	cookie: {
		secret: 'foreworld'
	}, corp: {
		name: 'FOREWORLD 洪荒',
		website: 'http://www.foreworld.net/'
	}, db: {
		database: 'foreworld',
		host: 'www.foreworld.net',
		port: 27017,
		user: 'sa',
		pass: 'xiang123'
	}, html: {
		cdn: 'http://www.foreworld.net/js/',
		static_res: '/public/',
		external_res: 'http://www.foreworld.net/public/',
		pagesize: 10,
		cache_time: 1000 * 60 * 60
	}, mail: {
		secureConnection: true,
		host: 'smtp.sina.com',
		port: 465,
		to: ['huangxin@foreworld.net', 'fxy_100@sina.com'],
		auth: {
			user: 'fxy_100@sina.com',
			pass: ''
		}
	}
};