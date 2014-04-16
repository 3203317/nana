var conf = require('../settings');
var EventProxy = require('eventproxy');
var Module = require('../modules/Module.js');
var util = require('../libs/utils');

var virtualPath = '';
var title = 'FOREWORLD 洪荒';

/**
 *
 * @method 模块管理
 * @params 
 * @return 
 */
exports.indexUI = function(req, res, next) {
	var proxy = EventProxy.create('modules', 'cmodules', function (modules, cmodules){
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

	Module.findModules({
		_id: 0,
		CreateTime: 0
	}, function (err, docs){
		if(err) return next(err);
		proxy.emit('modules', docs);
	});

	Module.findModulesByPId('0', function (err, docs){
		if(err) return next(err);
		proxy.emit('cmodules', docs);
	});
};

exports.moduleListUI = function(req, res, next) {
	var data = req._data;

	Module.findModulesByPId(data.PId, function (err, docs){
		if(err) return next(err);
		res.render('Manage/Module/ModuleList', {
			cmodules: docs
		});
	});
};