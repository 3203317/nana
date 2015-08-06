/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var md5 = require('speedt-utils').md5;

var models = require('../models'),
	Manager = models.Manager;

/**
 * 用户登陆
 *
 * @params {Object} logInfo 用户登陆信息
 * @params {Function} cb 回调函数
 * @return
 */
exports.login = function(logInfo, cb){
	Manager.findByName(logInfo.UserName, function (err, doc){
		if(err) return cb(err);
		if(!doc) return cb(null, 3, ['找不到该用户。', 'UserName']);
		if(md5.hex(logInfo.UserPass) !== doc.UserPass)
			return cb(null, 6, ['用户名或密码输入错误。', 'UserPass'], doc);
		cb(null, null, null, doc);
	});
};

/**
 * 
 * @params
 * @return
 */
exports.findById = function(id, cb){
	Manager.findOne({
		_id: id
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

/**
 * 
 * @params
 * @return
 */
exports.changePwd = function(user_id, oldPass, newPass, cb){
	Manager.findOne({
		_id: user_id
	}, null, null, function (err, doc){
		if(err) return cb(err);
		if(!doc) return cb(null, 3, ['找不到该用户。', 'UserName']);
		if(md5.hex(oldPass) !== doc.UserPass)
			return cb(null, 6, ['用户名或密码输入错误。', 'OldPass'], doc);
		doc.update({
			UserPass: md5.hex(newPass)
		}, function (err, count){
			if(err) return cb(err);
			cb(null, null, null, count);
		});
	});
};