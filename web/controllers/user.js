var User = require('../modules/User.js');

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
	var user = {
		username: 'hx',
		userpass: '123456'
	};

	User.findUser(user, function(err, docs){
		if(err){
			throw err;
		}

		res.send(user);
	});
};

exports.register = function(req, res, next) {
	var data;
	try{
		data = eval('('+ req.body.data +')');
	}catch(e){
		res.send({
			success: false
		});
		return;
	}

	User.findUserByUserName(data.UserName, function(err, doc){
		if('string' !== typeof err){
			throw err;
			return;
		}

		if('null' === typeof err){
			if(doc){
				res.send({
					success: false,
					msg: '用户名已经存在'
				});
			}else{
				User.register(data, function(err, doc){
					if(err){
						throw err;
						return;
					}
					res.send({
						success: true,
						msg: '新用户注册成功'
					});
				});
			}
		}
	});
};