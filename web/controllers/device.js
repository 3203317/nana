var conf = require('../settings');
var Device = require('../modules/Device.js');
var util = require('../libs/utils');

var virtualPath = '';
var title = 'FOREWORLD 洪荒';

exports.indexUI = function(req, res, next) {
	Device.findDevices([1, 10], function(err, docs){
		if(err) return next(err);
		res.render('Manage/Device/Index', {
			title: title,
			atitle: '设备管理',
			description: '设备管理',
			keywords: ',设备管理,Bootstrap3',
			virtualPath: virtualPath +'/',
			cdn: conf.cdn,
			devices: docs
		});
	});
};