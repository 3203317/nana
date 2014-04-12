var conf = require('../settings');
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
	Module.findModules({
		_id: 0,
		CreateTime: 0
	}, function(err, docs){
		if(err) return next(err);
		res.render('Manage/Module/Index', {
			title: title,
			atitle: '模块管理',
			description: '后台管理',
			keywords: ',模块管理,Bootstrap3',
			virtualPath: virtualPath +'/',
			cdn: conf.cdn,
			modules: docs
		});
	});
};