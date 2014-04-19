var conf = require('../settings');
var Role = require('../modules/Role.js');
var util = require('../libs/utils');

var virtualPath = '';
var title = 'FOREWORLD 洪荒';

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

	Role.saveNew(data, function (err, doc){
		if(err) return next(err);
		if('string' === typeof doc){
			result.msg = doc;
			return res.send(result);
		}
		result.success = true;
		res.send(result);
	});
};