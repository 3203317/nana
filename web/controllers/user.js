var User = require('../modules/User.js');
var util = require('../libs/utils');

var virtualPath = '';
var title = 'FOREWORLD 洪荒';

exports.loginUI = function(req, res, next) {
	res.render('User/Login', {
		title: title,
		atitle: '登陆',
		description: '个人博客',
		keywords: ',登陆,Bootstrap3',
		virtualPath: virtualPath +'/'
	});
};

exports.registerUI = function(req, res, next) {
	res.render('User/Register', {
		title: title,
		atitle: '新用户注册',
		description: '个人博客',
		keywords: ',新用户注册,Bootstrap3',
		virtualPath: virtualPath +'/'
	});
};

exports.login = function(req, res, next) {
	var result = { success: false },
		data = req._data;

	/* 表单参数验证 */
	if('' === data.UserName || '' === data.UserPass){
		result.msg = '用户名或密码不能为空';
		return res.send(result);
	}

	User.findUserByUserName(data.UserName, function (err, doc){
		if('string' === typeof err){
			result.msg = err;
			return res.send(result);
		}
		if(!err){
			if(util.md5(data.UserPass) === doc.UserPass){
				result.success = true;
				return res.send(result);
			}
			result.msg = '用户名或密码输入错误';
			return res.send(result);
		}
		next(err);
	});
};

/**
 * todo
 *
 * @method 用户名合法性验证
 * @params userName 用户名
 * @return 成功返回true
 */
function filterUserName(userName){
	return true;
}

exports.register = function(req, res, next) {
	var result = { success: false },
		data = req._data;

	/* 表单参数验证 */
	if('' === data.UserName || '' === data.UserPass){
		result.msg = '用户名或密码不能为空';
		return res.send(result);
	}

	if(!filterUserName(data.UserName)){
		result.msg = '用户名不合法';
		return res.send(result);
	}

	User.findUserByUserName(data.UserName, function (err, doc){
		if('string' === typeof err){
			User.register(data, function (err, doc){
				if(err) return next(err);
				result.success = true;
				result.msg = '新用户注册成功';
				res.send(result);
			});
			return;
		}
		if(!err){
			result.msg = '用户名已经存在';
			return res.send(result);
		}
		next(err);
	});
};