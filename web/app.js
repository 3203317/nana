
/**
 * Module dependencies.
 */

var log4js = require('log4js');
var express = require('express');
var routes = require('./routes');
// var user = require('./routes/user');
var http = require('http');
var path = require('path');

var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');

var cwd = process.cwd();
var fs = require('fs')

var app = express();
var velocity = require('velocityjs')

var title = 'FOREWORLD 洪荒';
var virtualPath = '/'

log4js.configure({
	appenders: [
		{
			type: 'console'
		}, {
			type: 'file',
			filename: 'logs/access.log',
			maxLogSize: 20480,
			backups: 4,
			category: 'http'
		}
	],
	replaceConsole: true
});

var logger = log4js.getLogger('app');
logger.setLevel('INFO');

app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto', format:':method :url' }));

logger.info('start')

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(flash());

// app.engine('.html', require('ejs').__express);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({
	secret: settings.cookieSecret,
	key: settings.db,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 30 //30 days
	},
	store: new MongoStore({
		db: settings.db
	})
}));

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.use(function (err, req, res, next){
	if(req.xhr){
		return res.send({
			success: false,
			msg: err
		});
	}
	res.render(500, {
		state: 500,
		msg: err.message,
		title: title,
		atitle: '500',
		description: '500',
		keywords: ',500,Bootstrap3',
		virtualPath: virtualPath,
		cdn: settings.cdn
	});
});

app.use(function (req, res) {
	if(req.xhr){
		return res.send({
			success: false,
			msg: 'Not found'
		});
	}
	res.render(404, {
		state: 404,
		url: req.url,
		title: title,
		atitle: '404',
		description: '个人博客',
		keywords: ',个人博客,Bootstrap3',
		virtualPath: virtualPath,
		cdn: settings.cdn
	});
});

app.engine('.html',function (path,options,fn){   
	fs.readFile(path, 'utf8', function (err, data){
		if(err) return fn(err);
		var macros = {  
			parse: function(file) {  
				var template = fs.readFileSync(cwd + '/views/' + file).toString()  
				return this.eval(template);  
			}
		}
		try{
			fn(null, velocity.render(data, options, macros));
		}catch(e){
			fn(e);
		}
	});
});

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler({
		showStack: true,
		dumpExceptions: true
	}));
}

// app.get('/', routes.index);
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
	routes(app);
});