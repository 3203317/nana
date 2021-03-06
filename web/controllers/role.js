var conf = require('../settings'),
	util = require('../libs/utils');

var Role = require('../modules/Role.js');

var virtualPath = '',
	title = 'FOREWORLD 洪荒';

/**
 *
 * @method 角色管理
 * @params 
 * @return 
 */
exports.indexUI = function(req, res, next) {
	Role.findRoles(function(err, docs){
		if(err) return next(err);
		res.render('Manage/Role/Index', {
			title: title,
			atitle: '角色管理',
			description: '角色管理',
			keywords: ',角色管理,Bootstrap3',
			virtualPath: virtualPath +'/',
			cdn: conf.cdn,
			roles: docs
		});
	});
};

/**
 *
 * @method 添加新角色
 * @params 
 * @return 
 */
exports.add = function(req, res, next) {
	var result = { success: false },
		data = req._data;

	Role.saveNew(data, function (err, status, msg, doc){
		if(err) return next(err);
		result.success = 1 === status;
		result.msg = msg;
		res.send(result);
	});
};

exports.del = function(req, res, next) {
	var result = { success: false },
		data = req._data;

	Role.removes(data, function (err, status, msg, count){
		if(err) return next(err);
		result.success = 1 === status;
		result.msg = msg;
		result.data = count;
		res.send(result);
	});
};

exports.edit = function(req, res, next) {
	var result = { success: false },
		data = req._data;

	Role.edit(data, function (err, status, msg, count){
		if(err) return next(err);
		result.success = 1 === status;
		result.msg = msg;
		result.data = count;
		res.send(result);
	});
};

exports.getId = function(req, res, next) {
	var result = { success: false },
		id = req.params.id.trim();

	Role.findRoleById(id, function (err, doc){
		if(err) return next(err);
		if(!doc) return res.send(result);
		result.data = [doc, {
			StartTime: doc.sStartTime,
			EndTime: doc.sEndTime,
			CreateTime: doc.sCreateTime
		}];
		result.success = true;
		res.send(result);
	});
};