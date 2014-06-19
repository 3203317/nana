var conf = require('../settings'),
	util = require('../libs/utils');

var User = require('../modules/User.js');

var virtualPath = '',
	title = 'FOREWORLD 洪荒';

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
	User.findUsers([1, 10], function (err, docs){
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
		refererUrl: escape('http://'+ req.headers.host + req.url),
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
exports.register_success = function(req, res, next) {
	var email = req.params.email.trim();
	res.redirect('/user/'+ email +'/register/sendEmail');
};

/**
 *
 * @method 注册激活
 * @params 
 * @return 
 */
exports.register_activateUI = function(req, res, next) {
	var email = req.params.email.trim();
	res.render('User/Register_Activate', {
		title: title,
		atitle: '新用户注册',
		description: '个人博客',
		keywords: ',新用户注册,Bootstrap3',
		virtualPath: virtualPath +'/',
		cdn: conf.cdn,
		user: {
			Email: email
		}
	});
};

/**
 *
 * @method 发送注册用户确认邮件成功
 * @params 
 * @return 
 */
exports.sendRegEmail_successUI = function(req, res, next) {
	var email = req.params.email.trim();
	res.render('User/SendRegEmail_Success', {
		title: title,
		atitle: '发送邮件',
		description: '发送邮件',
		keywords: ',发送邮件,Bootstrap3',
		virtualPath: virtualPath +'/',
		cdn: conf.cdn,
		user: {
			Email: email
		}
	});
};

/**
 *
 * @method 发送邮件
 * @params 
 * @return 
 */
exports.sendRegEmail = function(req, res, next) {
	var result = { success: false },
		email = req.params.email.trim();

	User.sendRegEmail(email, function (err, status, msg, doc){
		if(err) return next(err);
		if(1 === status) return res.redirect('/user/'+ email +'/register/sendEmail/success');
		res.render('User/SendRegEmail_Failure', {
			title: title,
			atitle: '发送邮件',
			description: '发送邮件',
			keywords: ',发送邮件,Bootstrap3',
			virtualPath: virtualPath +'/',
			cdn: conf.cdn,
			msg: msg,
			user: {
				Email: email
			}
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

	User.login(data.UserName, data.UserPass, function (err, status, msg, doc){
		if(err) return next(err);
		if(1 !== status){
			result.msg = msg;
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
		result.success = 1 === status;
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

exports.register_activate = function(req, res, next) {
};

exports.register_activate_successUI = function(req, res, next) {
};

exports.register_activate_failureUI = function(req, res, next) {
};