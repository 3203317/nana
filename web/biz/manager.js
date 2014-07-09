var md5 = require('../libs/md5'),
	models = require('../models');
var Manager = models.Manager,
	Module = models.Module;

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
		if(md5.hex(logInfo.UserPass) !== doc.UserPass)
			return cb(null, 5, ['用户名或密码输入错误。', 'UserPass'], doc);

		cb(null, 1, null, doc);
	});
};

/**
 * 查询管理员的可显示菜单树
 *
 * @params {Object} user_id
 * @params {Function} cb 回调函数
 * @return
 */
exports.getMenuTree = function(user_id, cb){
	Module.find(null, {
		CreateTime: 0
	}, {
		sort: {
			Sort: 1
		}
	}, function (err, docs){
		if(err) return cb(err);
		cb(null, 1, null, docs);
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
	Manager.findMgrByName(newInfo.UserName, function (err, doc){
		if(err) return cb(err);
		if(doc) return cb(null, 3, ['用户名已经存在', 'UserName'], doc);

		newInfo.UserPass = md5.hex(newInfo.UserPass);
		newInfo.CreateTime = new Date();
		newInfo.IsDel = 0;

		Manager.create(newInfo, function (err, doc){
			if(err) return cb(err);
			cb(null, 1, null, doc);
		});
	});
};

/**
 * Mgr 数据初始化安装
 *
 * @params {Function} cb 回调函数
 * @return
 */
exports.install = function(cb){
	var mgr = {
		UserName: 'admin',
		UserPass: '111111',
		Sex: 1,
		Email: 'huangxin@foreworld.net'
	};

	this.register(mgr, function (err, status, msg, doc){
		console.log('create user:', doc.UserName);
		cb(err, status, msg, doc);
	});
};