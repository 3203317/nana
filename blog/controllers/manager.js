var conf = require('../settings'),
	EventProxy = require('eventproxy');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

exports.loginUI = function(req, res, next){
	res.render('manager/Login', {
		title: '后台登陆 - '+ title,
		description: '',
		keywords: ',后台登陆,Bootstrap3,nodejs,express',
		virtualPath: virtualPath,
		cdn: conf.cdn
	});
};