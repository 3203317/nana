var md5 = require('../lib/md5');

var models = require('../models'),
	Manager = models.Manager;

/**
 * 用户登陆
 *
 * @params {Object} logInfo 用户登陆信息
 * @params {Function} cb 回调函数
 * @return
 */
exports.login = function(logInfo, cb){
	Manager.findUserByName(logInfo.UserName, function (err, doc){
		if(err) return cb(err);
		if(!doc) return cb(null, 3, ['找不到该用户。', 'UserName']);
		if(md5.hex(logInfo.UserPass) !== doc.UserPass)
			return cb(null, 6, ['用户名或密码输入错误。', 'UserPass'], doc);
		cb(null, 0, null, doc);
	});
};

exports.findById = function(id, cb){
	Manager.findOne({
		_id: id
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, 0, null, doc);
	});
};

exports.changePwd = function(user_id, oldPass, newPass, cb){
	Manager.findOne({
		_id: user_id
	}, null, null, function (err, doc){
		if(err) return cb(err);
		if(!doc) return cb(null, 3, ['找不到该用户。', 'UserName']);
		if(md5.hex(oldPass) !== doc.UserPass)
			return cb(null, 6, ['用户名或密码输入错误。', 'UserPass'], doc);
		doc.update({
			UserPass: md5.hex(newPass)
		}, function (err, count){
			if(err) return cb(err);
			cb(null, 0, null, count);
		});
	});
};