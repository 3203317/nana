var conf = require('../settings');
var User = require('../modules/User.js');
var util = require('../libs/utils');

var virtualPath = '';
var title = 'FOREWORLD 洪荒';

exports.analyticsUI = function(req, res, next) {
	res.render('User/Analytics', {
		title: title,
		atitle: '我的...',
		description: '我的...',
		keywords: ',我的...,Bootstrap3',
		virtualPath: virtualPath +'/',
		cdn: conf.cdn
	});
};

exports.indexUI = function(req, res, next) {
	User.findUsers([1, 10], function(err, docs){
		if(err) return next(err);

		res.render('Manage/User/Index', {
			title: title,
			atitle: '用户管理',
			description: '用户管理',
			keywords: ',用户管理,Bootstrap3',
			virtualPath: virtualPath +'/',
			cdn: conf.cdn,
			users: docs
		});
	});
};

exports.loginUI = function(req, res, next) {
	res.render('User/Login', {
		title: title,
		atitle: '登陆',
		description: '个人博客',
		keywords: ',登陆,Bootstrap3',
		virtualPath: virtualPath +'/',
		cdn: conf.cdn
	});
};

exports.registerUI = function(req, res, next) {
	res.render('User/Register', {
		title: title,
		atitle: '新用户注册',
		description: '个人博客',
		keywords: ',新用户注册,Bootstrap3',
		virtualPath: virtualPath +'/',
		cdn: conf.cdn
	});
};

exports.loginBackStageUI = function(req, res, next) {
	res.render('Manage/User/Login', {
		title: title,
		atitle: '后台登陆',
		description: '后台登陆',
		keywords: ',后台登陆,Bootstrap3',
		virtualPath: virtualPath +'/',
		cdn: conf.cdn
	});
};

exports.login = function(req, res, next) {
	var result = { success: false },
		data = req._data;

	User.login(data.UserName, data.UserPass, function (err, doc){
		if(err) return next(err);
		if('string' === typeof doc){
			result.msg = doc;
			return res.send(result);
		}
		result.success = true;
		res.send(result);
	});
};

/**
 *
 * @method 新用户注册
 * @params userName 用户名
 * @return 成功返回true
 */
exports.register = function(req, res, next) {
	var result = { success: false },
		data = req._data;

	User.register(data, function (err, doc){
		if(err){
			if('string' === typeof err){
				result.msg = err;
				return res.send(result);
			}
			return next(err);
		}
		result.success = true;
		result.msg = '新用户注册成功';
		res.send(result);
	});
};