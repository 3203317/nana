var conf = require('../settings');
var EventProxy = require('eventproxy');
var util = require('../libs/utils');

var Device = require('../modules/Device.js'),
	DeviceType = require('../modules/DeviceType.js');

var virtualPath = '',
	title = 'FOREWORLD 洪荒';

/**
 *
 * @method 设备管理
 * @params 
 * @return 
 */
exports.indexUI = function(req, res, next) {
	var ep = EventProxy.create('devices', 'deviceTypes', function (devices, deviceTypes){
		res.render('Manage/Device/Index', {
			title: title,
			atitle: '设备日志',
			description: '设备日志',
			keywords: ',设备日志,Bootstrap3',
			virtualPath: virtualPath +'/',
			cdn: conf.cdn,
			devices: devices,
			deviceTypes: deviceTypes
		});
	});

	ep.fail(function (err){
		next(err);
	});

	Device.findDevices([1, 10], ep.done('devices'));

	DeviceType.findDeviceTypes(ep.done('deviceTypes'));
};

/**
 *
 * @method 设备日志
 * @params 
 * @return 
 */
exports.logUI = function(req, res, next) {
	var ep = EventProxy.create('deviceTypes', function(deviceTypes){
		res.render('Manage/DeviceLog/Index', {
			title: title,
			atitle: '设备日志',
			description: '设备日志',
			keywords: ',设备日志,Bootstrap3',
			virtualPath: virtualPath +'/',
			cdn: conf.cdn,
			deviceTypes: deviceTypes
		});
	});

	ep.fail(function (err){
		next(err);
	});

	DeviceType.findDeviceTypes(ep.done('deviceTypes'));
};