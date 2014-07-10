var ObjectId = require('mongodb').ObjectID,
	md5 = require('../libs/md5'),
	models = require('../models');

var Module = models.Module;

/**
 * Create a module
 *
 * @params {Object} newInfo
 * @params {Function} cb 回调函数
 * @return
 */
exports.saveNew = function(newInfo, cb){

	newInfo.Sort = newInfo.Sort || 1;

	Module.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, 1, null, doc);
	});
};

/**
 * Mdl 数据初始化安装
 *
 * @params {Function} cb 回调函数
 * @return
 */
exports.install = function(cb){
	this.uninstall();

	var rootId = ObjectId('53bd13cc0f8ba7a0165764dc');

	var mod = {
		PId: rootId,
		ModuleName: '系统管理',
		ModuleUrl: '',
		Sort: 1
	};

	this.saveNew(mod, function (err, status, msg, doc){
		console.log('create a module:', doc.ModuleName);
		if(err) return cb(err);

		var mods = [{
			PId: doc._id,
			ModuleName: '模块管理',
			ModuleUrl: '/manage/module/index',
			Sort: 1
		}, {
			PId: doc._id,
			ModuleName: '角色管理',
			ModuleUrl: '/manage/role/index',
			Sort: 2
		}, {
			PId: doc._id,
			ModuleName: '用户管理',
			ModuleUrl: '/manage/manager/index',
			Sort: 3
		}];

		Module.create(mods, function (err, doc){
			if(err) return cb(err);
			console.log(arguments)
			cb(null, 1, null, doc);
		});
	});
};

/**
 * Mdl remove all data.
 *
 * @params {Function} cb 回调函数
 * @return
 */
exports.uninstall = function(cb){
	Module.remove({}, function (err, count){
		console.log(arguments)
	});
};