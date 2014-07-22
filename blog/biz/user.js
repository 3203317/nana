var models = require('../models');
var User = models.User;

/**
 * 用户登陆
 *
 * @params {Object} logInfo 用户登陆信息
 * @params {Function} cb 回调函数
 * @return
 */
exports.login = function(logInfo, cb){
	User.findUserByEmail(logInfo.Email, function (err, doc){
		if(err) return cb(err);
		if(!doc) return cb(null, 3, ['找不到该用户。', 'Email']);
		if(md5.hex(data.UserPass) !== doc.UserPass)
			return cb(null, 6, ['电子邮箱或密码输入错误。', 'UserPass'], doc);

		cb(null, 1, null, doc);
	});
};