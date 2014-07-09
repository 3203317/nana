var conf = require('../settings'),
	util = require('../libs/utils');

var User = require('../biz/user'),
	Mdl = require('../biz/module'),
	Mgr = require('../biz/manager');

var virtualPath = '',
	title = 'FOREWORLD 洪荒';

exports.installUI = function(req, res, next) {

	Mgr.install(function (err, status, msg, doc){
		if(err) return next(err);
		res.send({
			success: 1 === status,
			msg: msg,
			data: [doc, {
				CreateTime: doc.CreateTime
			}]
		});
	});

	Mdl.install(function (err, status, msg, doc){
		if(err) return next(err);
	});
};

exports.install = function(req, res, next) {
};