/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

/**
 *
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
	req.session.destroy();
	res.redirect('/user/login');
};