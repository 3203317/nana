var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var UserSchema = new Schema({
	UserName: {				// 用户名
		// required: true,
		// match: /[a-z]/,
		unique: true,
		type: String
	}, UserPass: {			// 密码
		type: String
	}, SecPass: {			// 加密后密码
		type: String,
		default: '123456'
	}, Sex: {				// 性别
		type: Number,
		default: 3
	}, Nickname: {			// 昵称
		type: String
	}, Birthday: {			// 生日
		type: Date
	}, QQ: {
		type: String
	}, AckCode: {			// 用户注册邮箱认证码
		type: String
	}, Email: {				// 邮箱
		type: String,
		index: true,
		required: true
	}, SafeEmail: {			// 安全邮箱
		type: String
	}, Status: {			// 状态, 未激活0, 邮箱激活1, 短信激活2
		type: Number,
		default: 0
	}, IsDel: {				// 删除标记, 删除1, 否0
		type: Number,
		default: 0
	}, ApiKey: {
		type: String
	}, SecKey: {			// 密钥
		type: String
	}
}, {
	versionKey: false,
	toObject: {
		virtuals: true
	}, toJSON: {
		virtuals: true
	}
});

/**
 * 通过用户名查找用户
 *
 * @params {String} userName 用户名（忽略大小写）
 * @params {Function} cb 回调函数
 * @return {Object} 用户对象
 */
UserSchema.statics.findUserByName = function(userName, cb){
	this.findOne({
		UserName: new RegExp('^'+ userName +'$', 'i')
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

/**
 * 通过用户名或电子邮箱查找用户
 *
 * @params {String} userName 用户名（忽略大小写）
 * @params {String} email 电子邮箱（忽略大小写）
 * @params {Function} cb 回调函数
 * @return {Object} 用户对象
 */
UserSchema.statics.findUserByNameEmail = function(userName, email, cb){
	this.findOne({
		'$or': [{
			UserName: new RegExp('^'+ userName +'$', 'i')
		}, {
			Email: new RegExp('^'+ email +'$', 'i')
		}]
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

/**
 * 通过邮箱查询用户
 *
 * @params {String} email 电子邮箱（忽略大小写）
 * @params {Function} cb 回调函数
 * @return {Object} 用户对象
 */
UserSchema.statics.findUserByEmail = function(email, cb){
	this.findOne({
		Email: new RegExp('^'+ email +'$', 'i')
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

mongoose.model('User', UserSchema);