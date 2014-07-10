var ObjectId = require('mongodb').ObjectID,
	async = require('async'),
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

	var that = this,
		rootId = ObjectId('53bd13cc0f8ba7a0165764dc');

	async.waterfall([
		function (cb){
			that.saveNew({
				PId: rootId,
				ModuleName: '系统管理',
				ModuleUrl: '',
				Sort: 1
			}, function (err, status, msg, doc){
				if(err) return cb(err);
				cb(null, doc);
			})
		}, function (n, cb){
			that.saveNew({
				PId: n._id,
				ModuleName: '模块管理',
				ModuleUrl: '/mg/module/index',
				Sort: 1
			}, function (err, status, msg, doc){
				if(err) return cb(err);
				cb(null, n);
			})
		}, function (n, cb){
			that.saveNew({
				PId: n._id,
				ModuleName: '角色管理',
				ModuleUrl: '/mg/role/index',
				Sort: 2
			}, function (err, status, msg, doc){
				if(err) return cb(err);
				cb(null, n);
			})
		}, function (n, cb){
			that.saveNew({
				PId: n._id,
				ModuleName: '用户管理',
				ModuleUrl: '/mg/mgr/index',
				Sort: 3
			}, function (err, status, msg, doc){
				if(err) return cb(err);
				cb(null, n);
			})
		}, function (n, cb){
			that.saveNew({
				PId: rootId,
				ModuleName: '业务系统',
				ModuleUrl: '',
				Sort: 2
			}, function (err, status, msg, doc){
				if(err) return cb(err);
				cb(null, doc);
			})
		}, function (n, cb){
			that.saveNew({
				PId: n._id,
				ModuleName: '用户管理',
				ModuleUrl: '/mg/user/index',
				Sort: 1
			}, function (err, status, msg, doc){
				if(err) return cb(err);
				cb(null, n);
			})
		}, function (n, cb){
			that.saveNew({
				PId: n._id,
				ModuleName: '设备管理',
				ModuleUrl: '/mg/device/index',
				Sort: 2
			}, function (err, status, msg, doc){
				if(err) return cb(err);
				cb(null, n);
			})
		}, function (n, cb){
			that.saveNew({
				PId: n._id,
				ModuleName: '设备日志',
				ModuleUrl: '/mg/devicelog/index',
				Sort: 3
			}, function (err, status, msg, doc){
				if(err) return cb(err);
				cb(null, n);
			})
		}, function (n, cb){
			that.saveNew({
				PId: rootId,
				ModuleName: '统计分析',
				ModuleUrl: '',
				Sort: 3
			}, function (err, status, msg, doc){
				if(err) return cb(err);
				cb(null, doc);
			})
		}
	], function (err, result){
		if(err) that.uninstall();
		cb(err, result);
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