var util = require('../libs/utils');

var virtualPath = '';
var title = 'FOREWORLD 洪荒';

exports.indexUI = function(req, res, next) {
	res.render('Role/Index', {
		title: title,
		atitle: '角色管理',
		description: '个人博客',
		keywords: ',角色管理,Bootstrap3',
		virtualPath: virtualPath +'/'
	});
};

exports.loginUI = function(req, res, next) {
	res.render('Role/Index', {
		title: title,
		atitle: '角色管理',
		description: '个人博客',
		keywords: ',角色管理,Bootstrap3',
		virtualPath: virtualPath +'/'
	});
};

exports.validate = function(req, res, next) {
	
};