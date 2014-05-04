exports.uuid = function(b) {
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
 **/
function pdate(s) {
	return 10 > s ? '0' + s : s;
}

exports.formatDate = function(date){
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
	return  strs.join('');
};

/* 生成随机字符串 */
var data = ['0','1','2','3','4','5','6','7','8','9',
			'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
			'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
/**
 *
 * @method 生成随机字符串
 * @params num 长度
 * @return 
 */
exports.random = function(num){
	var result = [];
	for(var i=0;i<num;i++){
		result.push(data[Math.floor(Math.random() * 62)]);
	}
	return result.join('');
};

/**
 *
 * @method 正则验证邮箱
 * @params 
 * @return 
 */
exports.regexEmail = function(val){
	var result = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+.)+[A-Za-z0-9]{2,3}$/.test(val);
	if(!result) return '电子邮箱不符合要求';
};

/**
 *
 * @method 验证用户名
 * @params 4-20位数字、字母、下划线或减号
 * @return 
 */
exports.regexUserName = function(val){
	var result = /^[a-zA-Z0-9_-]{4,20}$/.test(val);
	if(!result) return '用户名不符合要求'; 
};

/**
 *
 * @method 验证密码
 * @params 6-20位数字、字母、下划线或减号
 * @return 
 */
exports.regexUserPass = function(val){
	var result = /^[a-zA-Z0-9_-]{6,20}$/.test(val);
	if(!result) return '密码不符合要求';
};