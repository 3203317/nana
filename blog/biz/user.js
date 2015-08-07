/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var md5 = require('speedt-utils').md5;

var models = require('../models'),
	User = models.User;

/**
 * 用户登陆验证
 *
 * @params
 * @return
 */
exports.login = function(logInfo, cb){
	User.findByEmail(logInfo.Email, function (err, doc){
		if(err) return cb(err);
		if(!doc) return cb(null, 3, ['找不到该用户。', 'Email']);
		if(md5.hex(logInfo.UserPass) !== doc.UserPass)
			return cb(null, 6, ['电子邮箱或密码输入错误。', 'UserPass'], doc);
		cb(null, null, null, doc);
	});
};

/**
 * 查找用户通过用户名
 *
 * @params
 * @return
 */
exports.findByName = function(name, cb){
	User.findByName(name, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

/**
 *
 * @params
 * @return
 */
exports.findById = function(id, cb){
	User.findOne({
		_id: id
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

/**
 * 用户注册
 *
 * @params
 * @return
 */
exports.register = function(newInfo, cb){
	/* 查询邮箱是否存在 */
	User.findByEmail(newInfo.Email, function (err, doc){
		if(err) return cb(err);
		/* 如果用户对象存在，则说明电子邮箱存在，返回提示信息 */
		if(doc) return cb(null, 3, ['电子邮箱已经存在。', 'Email'], doc);
		/* 用户对象入库之前的其他数据初始化工作 */
		newInfo.Status = 0;
		newInfo.IsDel = 0;
		newInfo.SecPass = newInfo.UserPass;
		/* 密码加密 */
		newInfo.UserPass = md5.hex(newInfo.SecPass);
		/* 开始创建新用户 */
		User.create(newInfo, function (err, doc){
			if(err) return cb(err);
			cb(null, null, null, doc);
		});
	});
};

/**
 * 修改密码
 *
 * @params
 * @return
 */
exports.changePwd = function(user_id, oldPass, newPass, cb){
	User.findOne({
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

/**
 * 编辑
 *
 * @params
 * @return
 */
exports.editInfo = function(newInfo, cb){
	User.update({
		_id: newInfo.id
	}, {
		'$set': {
			Avatar_Url: newInfo.Avatar_Url
		}
	}, function (err, count){
		if(err) return cb(err);
		cb(null, count);
	});
};