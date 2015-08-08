/*!
 * blog
 * Copyright(c) 2015 foreworld.net <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var express = require('express'),
	MongoStore = require('connect-mongo')(express),
	flash = require('connect-flash'),
	velocity = require('velocityjs'),
	fs = require('fs'),
	http = require('http'),
	path = require('path'),
	cwd = process.cwd();

var macros = require('./lib/macro'),
	errorHandler = require("./lib/errorHandler"),
	conf = require('./settings'),  // session config
	dbconf = conf.db;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000)
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'html')
	/* use */
	.use(flash())
	.use(express.favicon())
	.use(express.json())
	.use(express.urlencoded())
	.use(express.methodOverride())
	.use(express.cookieParser());

// production
app.configure('production', function(){
	app.use('/public', express.static(path.join(__dirname, 'public'), { maxAge: 101000 }))
		.use(express.errorHandler())
		.use(express.logger('dev'));
});

// development
app.configure('development', function(){
	app.use(express.logger('dev'))
		.use('/public', express.static(path.join(__dirname, 'public')))
		.use(express.errorHandler({
			dumpExceptions: true,
			showStack: true
		}));
});

app.use(express.session({
	secret: conf.cookie.secret,
	key: dbconf.database,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 30  //30 days
	}, store: new MongoStore({
		// db: dbconf.database
		url: 'mongodb://'+ dbconf.user +':'+ dbconf.pass +'@'+ dbconf.host +':'+ dbconf.port +'/'+ dbconf.database,
		auto_reconnect: true
	})
}));

app.use(app.router)
	/* velocity */
	.engine('.html', function (path, options, fn){
		fs.readFile(path, 'utf8', function (err, data){
			if(err) return fn(err);
			try{ fn(null, velocity.render(data, options, macros)); }
			catch(ex){ fn(ex); }
		});
	});

errorHandler.appErrorProcess(app);

var server = http.createServer(app);
// server.setTimeout(5000);
server.listen(app.get('port'), function(){
	console.log('Express server listening on port %s.', app.get('port'));
	require('./routes')(app);
});