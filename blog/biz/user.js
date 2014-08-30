var md5 = require('../lib/md5');

var models = require('../models'),
	User = models.User;

/**
 * 用户登陆
 *
 * @params {Object} logInfo 用户登陆信息
 * @params {Function} cb 回调函数
 * @return
 */
exports.login = function(logInfo, cb){
	User.findUserByEmail(logInfo.Email, function (err, doc){
		if(err) return cb(err);
		if(!doc) return cb(null, 3, ['找不到该用户。', 'Email']);
		if(md5.hex(logInfo.UserPass) !== doc.UserPass)
			return cb(null, 6, ['电子邮箱或密码输入错误。', 'UserPass'], doc);
		cb(null, 0, null, doc);
	});
};

exports.register = function(newInfo, cb){
	/* 查询邮箱是否存在 */
	User.findUserByEmail(newInfo.Email, function (err, doc){
		if(err) return cb(err);
		/* 如果用户对象存在，则说明电子邮箱存在，返回提示信息 */
		if(doc) return cb(null, 3, ['电子邮箱已经存在。', 'Email'], doc);
		/* 用户对象入库之前的其他数据初始化工作 */
		newInfo.Status = 0;
		newInfo.IsDel = 0;
		newInfo.SecPass = newInfo.UserPass;
		/* 密码加密 */
		newInfo.UserPass = md5.hex(newInfo.SecPass);
		/* 开始创建新用户 */
		User.create(newInfo, function (err, doc){
			if(err) return cb(err);
			cb(null, 0, null, doc);
		});
	});
};

exports.findByName = function(userName, cb){
	User.findUserByName(userName, function (err, doc){
		if(err) return cb(err);
		cb(null, 0, null, doc);
	});
};

exports.findById = function(id, cb){
	User.findOne({
		_id: id
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, 0, null, doc);
	});
};

exports.changePwd = function(user_id, oldPass, newPass, cb){
	User.findOne({
		_id: user_id
	}, null, null, function (err, doc){
		if(err) return cb(err);
		if(!doc) return cb(null, 3, ['找不到该用户。', 'Email']);
		if(md5.hex(oldPass) !== doc.UserPass)
			return cb(null, 6, ['密码输入错误。', 'UserPass'], doc);
		doc.update({
			UserPass: md5.hex(newPass)
		}, function (err, count){
			if(err) return cb(err);
			cb(null, 0, null, count);
		});
	});
};