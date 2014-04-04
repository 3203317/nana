var Role = require('../modules/Role.js');
var util = require('../libs/utils');

var virtualPath = '';
var title = 'FOREWORLD 洪荒';

exports.indexUI = function(req, res, next) {
	res.render('Role/Index', {
		title: title,
		atitle: '角色管理',
		description: '个人博客',
		keywords: ',角色管理,Bootstrap3',
		virtualPath: virtualPath +'/'
	});
};

exports.saveNew = function(req, res, next) {
	var result = { success: false },
		data = req._data;

	/* 表单参数验证 */
	if('' === data.RoleName){
		result.msg = '角色名不能为空';
		return res.send(result);
	}

	Role.findRoleByRoleName(data.RoleName, function (err, doc){
		if('string' === typeof err){
			Role.register(data, function (err, doc){
				if(err) return next(err);
				result.success = true;
				result.msg = '新角色创建成功';
				res.send(result);
			});
			return;
		}
		if(!err){
			result.msg = '角色名已经存在';
			return res.send(result);
		}
		next(err);
	});
};