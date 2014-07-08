var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var util = require('../libs/utils');

var ManagerSchema = new Schema({
	UserName: {
		type: String,
		required: true
	},
	UserPass: {
		type: String
	},
	Sex: {
		type: Number,
		default: 1
	},
	Email: {			//邮箱
		type: String,
		required: true
	},
	CreateTime: {
		type: Date,
		default: Date.now
	},
	IsDel: {			//删除标记, 删除1, 否0
		type: Number,
		default: 0
	}
}, {
	versionKey: false
});

ManagerSchema.virtual('sSex').get(function(){
	switch(this.Sex){
		case 1: return '男';
		case 2: return '女';
		default: return '未知';
	}
});

ManagerSchema.virtual('sCreateTime').get(function(){
	return this.CreateTime.format();
});

ManagerSchema.pre('save', function (next, done){
	next();
});

ManagerSchema.post('save', function(){
});

/**
 * Find mgr object by username field.
 *
 * @params {String} userName 用户名（忽略大小写）
 * @params {Function} cb 回调函数
 * @return {Object} mgr object
 */
ManagerSchema.statics.findUserByName = function(userName, cb) {
	this.findOne({
		UserName: new RegExp(userName, 'i')
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

mongoose.model('Manager', ManagerSchema);