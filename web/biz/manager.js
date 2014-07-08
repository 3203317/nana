var models = require('../models');
var Manager = models.Manager;

/**
 * Mgr login
 *
 * @params {Object} logInfo
 * @params {Function} cb 回调函数
 * @return
 */
exports.login = function(logInfo, cb){
	Manager.findMgrByName(logInfo.UserName, function (err, doc){
		if(err) return cb(err);
		if(!doc) return cb(null, 3, ['找不到该管理员。', 'UserName']);
		if(doc.IsDel) return cb(null, 4, ['该管理员已禁止登陆。', 'UserName'], doc);
		if(md5.hex(data.UserPass) !== doc.UserPass)
			return cb(null, 5, ['用户名或密码输入错误。', 'UserPass'], doc);

		cb(null, 1, null, doc);
	});
};

/**
 * Mgr login
 *
 * @params {Object} logInfo
 * @params {Function} cb 回调函数
 * @return
 */
exports.register = function(newInfo, cb){
	Manager.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, 1, null, doc);
	});
};

exports.install = function(cb){
	var mgr = {
		UserName: 'admin',
		UserPass: '111111',
		Sex: 1,
		Email: 'huangxin@foreworld.net'
	};

	this.register(mgr, function (err, doc){
		console.log('create user: ', doc.UserName);
	});
};