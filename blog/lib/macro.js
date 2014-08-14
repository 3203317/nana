var cwd = process.cwd(),
	fs = require('fs'),
	velocity = require('velocityjs'),
	util = require('./util');

module.exports = {
	parse: function(file){
		var template = fs.readFileSync(require('path').join(cwd, 'views', file)).toString();
		return this.eval(template);
	}, include: function(file){
		var template = fs.readFileSync(require('path').join(cwd, 'views', file)).toString();
		return template;
	}, toMon: function(t){
		return util.pdate(t.getMonth() + 1);
	}, toDay: function(t){
		return util.pdate(t.getDate());
	}, formatDate: function(t){
		return t.format();
	}, num2Money: function(n){
		return util.threeSeparator(n);
	}, toSDate: function(t){
		var y = t.getFullYear();
		var m = util.pdate(t.getMonth() + 1);
		var d = util.pdate(t.getDate());
		return y +'-'+ m +'-'+ d;
	}, toHtml: function(s){
		return velocity.Parser.parse(s);
	}
};