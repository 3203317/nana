var User = require('../modules/User.js');

var virtualPath = '';
var title = 'FOREWORLD 洪荒';

function md5(str){
	return str;
}

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
	var data, result = { success: false };
	try{
		data = eval('('+ req.body.data +')');
	}catch(e){
		result.msg = '参数异常';
		res.send(result);
		return;
	}

	User.findUserByUserName(data.UserName, function(err, doc){
		if(err){
			result.msg = err;
			res.send(result);
			return;
		}
		if(doc && md5(data.UserPass) === doc.UserPass){
			result.success = true;
			res.send(result);
			return;
		}
		res.send(result);
	});
};

/**
 * todo
 *
 * @method 验证用户注册表单参数
 * @params data
 * @return 成功返回true
 */
function valRegForm(data){
	if('' === data.UserName || '' === data.UserPass){
		return false;
	}
	return true;
}

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
	var data, result = { success: false };
	try{
		data = eval('('+ req.body.data +')');
	}catch(e){
		result.msg = '参数异常';
		res.send(result);
		return;
	}

	if(!valRegForm(data)){
		result.msg = '用户名或密码不能为空';
		res.send(result);
		return;
	}

	if(!filterUserName(data.UserName)){
		result.msg = '用户名不合法';
		res.send(result);
		return;
	}

	User.findUserByUserName(data.UserName, function(err, doc){
		if('string' === typeof err){
			User.register(data, function(err, doc){
				if(err){
					result.msg = err;
					res.send(result);
					return;
				}
				result.success = true;
				result.msg = '新用户注册成功';
				res.send(result);
			});
			return;
		}
		if(!err){
			result.msg = '用户名已经存在';
			res.send(result);
			return;
		}
		res.send(result);
	});
};