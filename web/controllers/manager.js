var conf = require('../settings'),
	util = require('../libs/utils');

var Manager = require('../modules/Manager.js');

var virtualPath = '',
	title = 'FOREWORLD 洪荒';

exports.loginUI = function(req, res, next) {
	res.render('manage/manager/Login', {
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

	Manager.login(data, function (err, status, msg, doc){
		if(err) return next(err);
		if(1 !== status){
			result.msg = msg;
			return res.send(result);
		}
		req.session.userId = doc.Id;
		req.session.role = 'manager';
		req.session.user = doc;
		result.success = true;
		res.send(result);
	});
};

exports.indexUI = function(req, res, next) {
	Manager.findUsers([1, 10], function (err, docs){
		if(err) return next(err);
		res.render('Manage/Manager/Index', {
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

exports.logout = function(req, res, next) {
	req.session.destroy();
	res.redirect('/manage/manager/login');
};

exports.getId = function(req, res, next) {
	var result = { success: false },
		id = req.params.id.trim();

	Manager.findUserById(id, function (err, doc){
		if(err) return next(err);
		if(!doc) return res.send(result);
		result.data = [doc, {
			Sex: doc.sSex,
			CreateTime: doc.sCreateTime
		}];
		result.success = true;
		res.send(result);
	});
};