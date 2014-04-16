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