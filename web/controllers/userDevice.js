var UserDevice = require('../modules/UserDevice.js');
var util = require('../libs/utils');

var virtualPath = '';
var title = 'FOREWORLD 洪荒';

exports.myDeviceUI = function(req, res, next) {
	res.render('User/MyDevice', {
		title: title,
		atitle: '我的设备',
		description: '个人博客',
		keywords: ',我的设备,Bootstrap3',
		virtualPath: virtualPath +'/'
	});
};