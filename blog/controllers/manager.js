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

exports.changePwdUI = function(req, res, next){
	res.render('manager/ChangePwd', {
		title: '修改登录密码 - 后台管理 - '+ title,
		description: '',
		keywords: ',修改登录密码,Bootstrap3,nodejs,express',
		virtualPath: virtualPath,
		frmUrl: 'pw',
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