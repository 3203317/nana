var conf = require('../settings');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

exports.loginUI = function(req, res, next){
	res.render('user/Login', {
		title: title,
		atitle: '用户管理',
		description: '用户管理',
		keywords: ',用户管理,Bootstrap3',
		virtualPath: virtualPath,
		refererUrl: escape('http://'+ req.headers.host + req.url),
		cdn: conf.cdn
	});
};

exports.regUI = function(req, res, next){
	res.render('user/Register', {
		title: title,
		atitle: '新用户注册',
		description: '新用户注册',
		keywords: ',新用户注册,Bootstrap3',
		virtualPath: virtualPath,
		cdn: conf.cdn
	});
};