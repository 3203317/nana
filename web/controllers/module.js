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
	var result = { success: false },
		data = req._data;

	Module.findModulesByPId(data.PId, function (err, docs){
		if(err) return next(err);

		fs.readFile(cwd +'/views/Manage/Module/ModuleList.html', 'utf8', function (err, data){
			if(err) return next(err);

			var template = data;

			var html = velocity.render(template, {
				cmodules: docs
			});

			result.msg = html;
			result.success = true;
			res.send(result);
		});
	});
};