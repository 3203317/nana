
/**
 * Module dependencies.
 */

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
		maxAge: 1000 * 60 * 60 * 24 * 30
	},//30 days
	store: new MongoStore({
		db: settings.db
	})
}));

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.engine('.html',function(path,options,fn){   
	fs.readFile(path, 'utf8', function(err, data){
		if(err){
			fn(err);
			return;
		}
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