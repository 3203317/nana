var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var ManagerSchema = new Schema({
	UserName: {				// 用户名
		// required: true,
		// match: /[a-z]/,
		unique: true,
		type: String
	}, UserPass: {			// 密码
		type: String
	}, Sex: {				// 性别
		type: Number,
		default: 3
	}, Email: {				// 邮箱
		type: String,
		index: true,
		required: true
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
ManagerSchema.statics.findUserByName = function(userName, cb){
	this.findOne({
		UserName: new RegExp('^'+ userName +'$', 'i')
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

mongoose.model('Manager', ManagerSchema);