var conf = require('../settings'),
	EventProxy = require('eventproxy');

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

var Manager = require('../biz/manager');

exports.loginUI = function(req, res, next){
	res.render('manager/Login', {
		title: '后台登陆 - '+ title,
		description: '',
		keywords: ',Bootstrap3,nodejs,express',
		virtualPath: virtualPath,
		cdn: conf.cdn
	});
};

exports.login = function(req, res, next){
	var result = { success: false },
		data = req._data;
	Manager.login(data, function (err, status, msg, doc){
		if(err) return next(err);
		if(!!status){
			result.msg = msg;
			return res.send(result);
		}
		/* session */
		req.session.lv = 1;
		req.session.userId = doc._id;
		req.session.role = 'user';
		req.session.user = doc;
		/* result */
		result.success = true;
		result.data = { UserName: doc.UserName };
		res.send(result);
	});
};

exports.changePwdUI = function(req, res, next){
	res.render('manager/ChangePwd', {
		title: '修改登录密码 - 后台管理 - '+ title,
		description: '',
		keywords: ',Bootstrap3,nodejs,express',
		virtualPath: virtualPath,
		cdn: conf.cdn
	});
};

exports.changePwd = function(req, res, next){
	var result = { success: false },
		data = req._data;
	var user = req.session.user;

	if(!data.NewPass || !data.NewPass.trim().length){
		result.msg = ['新密码不能为空。', 'NewPass'];
		return res.send(result);
	}

	User.changePwd(user._id, data.OldPass, data.NewPass, function (err, status, msg, doc){
		if(err) return next(err);
		result.success = !status;
		result.msg = msg;
		res.send(result);
	});
};