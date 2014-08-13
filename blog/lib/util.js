exports.uuid = function(b){
	var s = [];
	var hexDigits = '0123456789abcdef';
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = b ? '-' : '';

	var uuid = s.join('');
	return uuid;
};

/**
 * 日期小于10补0
 *
 * @params {String}
 * @return {String}
 */
var pdate = exports.pdate = function(s){
	return 10 > s ? '0' + s : s;
}

exports.formatDate = function(date){
	if(!date) return;
	var strs = [];
	strs.push(date.getFullYear());
	strs.push('/');
	strs.push(pdate(date.getMonth()+1));
	strs.push('/');
	strs.push(pdate(date.getDate()));
	strs.push(' ');
	strs.push(date.getHours());
	strs.push(':');
	strs.push(pdate(date.getMinutes()));
	strs.push(':');
	strs.push(pdate(date.getSeconds()));
	return strs.join('');
};

/**
 * 日期格式化
 *
 * @params {String} format 格式化字符串，默认为yyyy-MM-dd HH:mm:ss，例2014-07-08 11:57:32
 *					1、yyyy-MM-dd，例2014-07-08
 * @return {String} 格式化后日期
 */
Date.prototype.format = function(format){
	switch(format){
		case 'yyyy-MM-dd':
			return this.getFullYear() +'-'+
					pdate(this.getMonth()+1) +'-'+
					pdate(this.getDate());
		default: 	// 'yyyy-MM-dd HH:mm:ss'
			return this.getFullYear() +'-'+
					pdate(this.getMonth()+1) +'-'+
					pdate(this.getDate()) +' '+
					pdate(this.getHours()) +':'+
					pdate(this.getMinutes()) +':'+
					pdate(this.getSeconds());
	}
};

/* 生成随机字符串 */
var a_z0_9A_Z = ['0','1','2','3','4','5','6','7','8','9',
			'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
			'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
/**
 * 生成随机字符串
 *
 * @params {Number} num 长度
 * @return 
 */
exports.random = function(num){
	var str = '';
	for(var i=0; i<num; i++){
		str += (a_z0_9A_Z[Math.floor(Math.random() * 62)]);
	}
	return str;
};

/**
 * 判断是否是Email格式
 *
 * @params {String} email
 * @return bool
 */
exports.isEmail = function(email){
	return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email);
}

/**
 * 格式化返回货币描述
 *
 * @params {Number} email
 * @return 1,230
 */
exports.threeSeparator = function(num){
	num = num + '';
	var re = /(-?\d+)(\d{3})/;
	while(re.test(num)){
		num = num.replace(re, '$1,$2');
	}
	return num;
};

var hexTable = [];
for (var i=0; i<256; i++) {
	hexTable[i] = (i <= 15 ? '0' : '') + i.toString(16);
}

var ObjectID = require('mongodb').ObjectID;

/**
 * 根据指定的时间，生成自定义ObjectId
 *
 * @params {Date} time
 * @return
 */
exports.genObjectId = function(time){
	var obj = new ObjectID();
	var id = obj.generate(parseInt(time/1000,10));

	var hexString = '';
	for (var i=0; i<id.length; i++) {
		hexString += hexTable[id.charCodeAt(i)];
	}
	return hexString;
};