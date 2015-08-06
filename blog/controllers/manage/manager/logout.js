/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

/**
 * 用户退出
 *
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
	req.session.destroy();
	res.redirect('/manager/login');
};