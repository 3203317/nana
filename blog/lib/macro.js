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
		return velocity.render(s);
	}, toSex: function(n){
		switch(n){
			case 1: return '男';
			case 2: return '女';
			default: return '未知';
		}
	}, userState: function(n){
		switch(n){
			case 0: return '未激活';
			case 1: return '邮箱';
			case 2: return '短信';
			default: return '未知';
		}
	}
};