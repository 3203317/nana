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

/**
 *
 * @method 发送注册用户确认邮件
 * @params 
 * @return 
 */
exports.sendRegEmailUI = function(req, res, next) {
	var userName = req.params.name.trim();

	User.sendRegEmail(userName, function (err, status, msg, doc, ackCode){
		if(err) return next(err);
		res.render('User/SendRegEmail', {
			title: title,
			atitle: '激活邮箱',
			description: '激活邮箱',
			keywords: ',激活邮箱,Bootstrap3',
			virtualPath: virtualPath +'/',
			cdn: conf.cdn,
			user: doc,
			ackCode: ackCode,
			msg: msg,
			status: status
		});
	});
};

exports.ackRegEmailUI = function(req, res, next) {
	var userName = req.params.name.trim(),
		ackCode = req.params.code.trim();
	User.ackRegEmail(userName, ackCode, function (err, status, msg, doc){
		if(err) return next(err);
		res.render('User/AckRegEmail', {
			title: title,
			atitle: '用户激活',
			description: '用户激活',
			keywords: ',用户激活,Bootstrap3',
			virtualPath: virtualPath +'/',
			cdn: conf.cdn,
			user: doc,
			msg: msg,
			status: status
		});
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
		req.session.userId = doc.Id;
		req.session.role = 'user';
		req.session.user = doc;
		result.success = true;
		res.send(result);
	});
};

/**
 *
 * @method 新用户注册
 * @params 
 * @return 
 */
exports.register = function(req, res, next) {
	var result = { success: false },
		data = req._data;

	User.register(data, function (err, status, msg, doc){
		if(err) return next(err);
		result.success = !!doc;
		result.msg = msg;
		res.send(result);
	});
};

exports.validate = function(req, res, next) {
	if('user' === req.session.role) return next();
	if(req.xhr){
		return res.send({
			success: false,
			code: 300,
			msg: '无权访问'
		});
	}
	res.redirect('/user/login');
};