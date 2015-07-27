/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var express = require('express'),
	velocity = require('velocityjs');

var cwd = process.cwd(),
	fs = require('fs'),
	http = require('http'),
	path = require('path');

var macros = require('./lib/macro'),
	errorHandler = require("./lib/errorHandler");

/* session config */
var settings = require('./settings'),
	MongoStore = require('connect-mongo')(express),
	flash = require('connect-flash');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000)
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'html')
	/* use */
	.use(flash())
	.use(express.favicon())
	.use('/public', express.static(path.join(__dirname, 'public')))
	.use(express.logger('dev'))
	.use(express.json())
	.use(express.urlencoded())
	.use(express.methodOverride())
	.use(express.cookieParser())
	.use(express.session({
		secret: settings.cookieSecret,
		key: settings.db,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 30 //30 days
		},
		store: new MongoStore({
			// db: settings.db
			url: 'mongodb://'+ settings.user +':'+ settings.pass +'@'+ settings.host +':'+ settings.port +'/'+ settings.db
		})
	}))
	.use(app.router)
	/* velocity */
	.engine('.html', function (path, options, fn){
		fs.readFile(path, 'utf8', function (err, data){
			if(err) return fn(err);
			try{ fn(null, velocity.render(data, options, macros)); }
			catch(e){ fn(e); }
		});
	});

errorHandler.appErrorProcess(app);

// production
app.configure('production', function(){
	app.use(express.errorHandler());
});

// development
app.configure('development', function(){
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
});

var server = http.createServer(app);
// server.setTimeout(5000);
server.listen(app.get('port'), function(){
	console.log('Express server listening on port %s.', app.get('port'));
	require('./routes')(app);
});