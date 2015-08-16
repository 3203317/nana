/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	mailService = util.service.mail;

exports.appErrorProcess = function(app){

	app.configure(function(){
		// error hanlder
		app.use(function (req, res, next){
			if(req.xhr){
				return res.send({ success: false, msg: 'Not found' });
			}
			res.send(404, 'Not found');
		});

		app.use(function (err, req, res, next){
			if(!err) return next();
			if(req.xhr){
				return res.send({ success: false, msg: err.message });
			}
			res.send(500, err.message);
		});

		process.on('uncaughtException', function (err){
			// TODO: send email
			mailService.sendMail({
				subject: 'foreworld.net [App Error]',
				html: err.message +'\n'+ err.stack +'\n'+ err.toString()
			});
			console.log(err);
		});
	});
};