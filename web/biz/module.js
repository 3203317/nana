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
	newInfo.CreateTime = new Date();

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

	var mod = {
		PId: ObjectId('53bd13cc0f8ba7a0165764dc'),
		ModuleName: '系统管理',
		ModuleUrl: '',
		Sort: 1
	};

	this.saveNew(mod, function (err, status, msg, doc){
		console.log('create a module:', doc.ModuleName);
		cb(err, status, msg, doc);
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