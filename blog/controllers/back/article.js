/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	EventProxy = require('eventproxy'),
	path = require('path'),
	cwd = process.cwd();

var conf = require('../../settings');

var proxy = {
	category: require('../../proxy/CATEGORY')
};

var biz = {
	user: require('../../biz/user'),
	comment: require('../../biz/comment'),
	link: require('../../biz/link'),
	article: require('../../biz/article')
};

/**
 *
 * @params
 * @return
 */
exports.createUI = function(req, res, next){
	// TODO
};

/**
 *
 * @params
 * @return
 */
exports.create = function(req, res, next){
	// TODO
};

/**
 *
 * @params
 * @return
 */
exports.remove = function(req, res, next){
	// TODO
};

/**
 *
 * @params
 * @return
 */
exports.editUI = function(req, res, next){
	// TODO
};

/**
 *
 * @params
 * @return
 */
exports.edit = function(req, res, next){
	// TODO
};