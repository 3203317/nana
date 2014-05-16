var conf = require('../settings');
var EventProxy = require('eventproxy');
var Module = require('../modules/Module.js');
var util = require('../libs/utils');

var fs = require('fs')
var velocity = require('velocityjs')
var cwd = process.cwd();

var virtualPath = '';
var title = 'FOREWORLD 洪荒';

/**
 *
 * @method 模块管理
 * @params 
 * @return 
 */
exports.indexUI = function(req, res, next) {
	var ep = EventProxy.create('modules', 'cmodules', function (modules, cmodules){
		res.render('Manage/Module/Index', {
			title: title,
			atitle: '模块管理',
			description: '后台管理',
			keywords: ',模块管理,Bootstrap3',
			virtualPath: virtualPath +'/',
			cdn: conf.cdn,
			modules: modules,
			cmodules: cmodules
		});
	});

	ep.fail(function (err){
		next(err);
	});

	Module.findModules({
		_id: 0,
		CreateTime: 0
	}, ep.done('modules'));

	Module.findModulesByPId('0', ep.done('cmodules'));
};

exports.moduleListUI = function(req, res, next) {
	var result = { success: false },
		id = req.params.id.trim();

	Module.findModulesByPId(id, function (err, docs){
		if(err) return next(err);

		fs.readFile(cwd +'/views/Manage/Module/ModuleList.html', 'utf8', function (err, template){
			if(err) return next(err);

			var html = velocity.render(template, {
				cmodules: docs
			});

			result.data = html;
			result.success = true;
			res.send(result);
		});
	});
};

exports.add = function(req, res, next) {
	var result = { success: false },
		data = req._data;

	Module.saveNew(data, function (err, doc){
		if(err) return next(err);
		result.success = !!doc;
		res.send(result);
	});
};

exports.del = function(req, res, next) {
	var result = { success: false },
		data = req._data;

	Module.removes(data.Ids, function (err, count){
		if(err) return next(err);
		result.success = !!count;
		result.msg = count;
		res.send(result);
	});
};

exports.edit = function(req, res, next) {
	var result = { success: false },
		data = req._data;

	Module.edit(data, function (err, count){
		if(err) return next(err);
		result.success = !!count;
		result.msg = count;
		res.send(result);
	});
};

exports.getId = function(req, res, next) {
	var result = { success: false },
		id = req.params.id.trim();

	Module.findModuleById(id, function (err, doc){
		if(err) return next(err);
		if('string' === typeof doc){
			result.msg = doc;
			return res.send(result);
		}
		result.data = [doc, {
			CreateTime: doc.sCreateTime
		}];
		result.success = true;
		res.send(result);
	});
};