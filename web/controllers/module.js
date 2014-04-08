var conf = require('../settings');
var Module = require('../modules/Module.js');
var util = require('../libs/utils');

var virtualPath = '';
var title = 'FOREWORLD 洪荒';

exports.indexUI = function(req, res, next) {

	Module.findModules(function(err, docs){
		if(docs){
			res.render('Manage/Module/Index', {
				title: title,
				atitle: '模块管理',
				description: '后台管理',
				keywords: ',模块管理,Bootstrap3',
				virtualPath: virtualPath +'/',
				cdn: conf.cdn,
				modules: docs
			});
		}
	});
};

exports.install = function(req, res, next) {
	Module.saveNew({
		Id: '9dea3de18553497284a0e9777c37291b',
		PId: '0',
		ModuleName: '系统管理',
		ModuleUrl: '',
		Sort: 1
	}, function(err, doc){ console.log(arguments); });

	Module.saveNew({
		Id: 'c5f1f1c14a9c42d88629498054bf5ba2',
		PId: '9dea3de18553497284a0e9777c37291b',
		ModuleName: '模块管理',
		ModuleUrl: '',
		Sort: 1
	}, function(err, doc){ console.log(arguments); });

	Module.saveNew({
		Id: 'a4c691697b8a4d5baf63ee2b54f37a31',
		PId: '9dea3de18553497284a0e9777c37291b',
		ModuleName: '角色管理',
		ModuleUrl: '',
		Sort: 2
	}, function(err, doc){ console.log(arguments); });

	Module.saveNew({
		Id: '7888a2a5de5c47d68cb80fe8415b2b0b',
		PId: '9dea3de18553497284a0e9777c37291b',
		ModuleName: '用户管理',
		ModuleUrl: '',
		Sort: 3
	}, function(err, doc){ console.log(arguments); });

	res.send({
		success: true
	});
};

exports.uninstall = function(req, res, next) {
	Module.removeAll(function(){
		console.log(arguments)
	});

	res.send({
		success: true
	});
};