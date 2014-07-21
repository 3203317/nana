var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path');


var cwd = process.cwd(),
	fs = require('fs')

var routes = require('./routes'),
	velocity = require('velocityjs')

var app = express();

var title = 'FOREWORLD 洪荒',
	virtualPath = '/';

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

/* velocity */
app.engine('.html', function (path, options, fn){
	fs.readFile(path, 'utf8', function (err, data){
		if(err) return fn(err);
		var macros = {
			parse: function(file){
				var template = fs.readFileSync(cwd + '/views/' + file).toString();
				return this.eval(template);
			}
		}
		try{ fn(null, velocity.render(data, options, macros)); }
		catch(e){ fn(e); }
	});
});

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
	routes(app);
});
