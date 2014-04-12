var conf = require('../settings');
var EventProxy = require('eventproxy');
var util = require('../libs/utils');

var Device = require('../modules/Device.js');
var DeviceType = require('../modules/DeviceType.js');

var virtualPath = '';
var title = 'FOREWORLD 洪荒';

/**
 *
 * @method 设备管理
 * @params 
 * @return 
 */
exports.indexUI = function(req, res, next) {
	var proxy = EventProxy.create('devices', 'deviceTypes', function(devices, deviceTypes){
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

	Device.findDevices([1, 10], function(err, docs){
		if(err) return next(err);		
		proxy.emit('devices', docs);
	});

	DeviceType.findDeviceTypes(function(err, docs){
		if(err) return next(err);
		proxy.emit('deviceTypes', docs);
	});
};

/**
 *
 * @method 设备日志
 * @params 
 * @return 
 */
exports.logUI = function(req, res, next) {
	var proxy = EventProxy.create('deviceTypes', function(deviceTypes){
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

	DeviceType.findDeviceTypes(function(err, docs){
		if(err) return next(err);
		proxy.emit('deviceTypes', docs);
	});
};