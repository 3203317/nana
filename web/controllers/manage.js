var conf = require('../settings');
var util = require('../libs/utils');
var User = require('../modules/User.js');

var virtualPath = '';
var title = 'FOREWORLD 洪荒';

exports.indexUI = function(req, res, next) {
	User.getMenuTree('abc', function(err, docs){
		if(err) return next(err);
		res.render('Manage/Main', {
			title: title,
			atitle: '后台管理',
			description: '后台管理',
			keywords: ',后台管理,Bootstrap3',
			virtualPath: virtualPath +'/',
			cdn: conf.cdn,
			modules: docs
		});
	});
};

exports.welcomeUI = function(req, res, next) {
	res.render('Manage/Welcome', {
		title: title,
		atitle: '角色管理',
		description: '个人博客',
		keywords: ',角色管理,Bootstrap3',
		virtualPath: virtualPath +'/',
		cdn: conf.cdn
	});
};

exports.validate = function(req, res, next) {
	
};