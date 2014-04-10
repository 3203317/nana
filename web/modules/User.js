var db = require('./mongodb');
var util = require('../libs/utils');
var Module = require('./Module');

var mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var UserSchema = new Schema({
	Id: {
		type: String,
		unique: true,
		index: true
	},
	UserName: {
		type: String,
		required: true
	},
	UserPass: {
		type: String,
		default: '123456'
	},
	Sex: {
		type: Number,
		default: 1
	},
	Birthday: {
		type: Date
	},
	Email: {
		type: String
	},
	RegTime: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false
});

UserSchema.virtual('sSex').get(function(){
	switch(this.Sex){
		case 1: return '男';
		case 2: return '女';
		default: return '未知';
	}
});

UserSchema.virtual('sBirthday').get(function(){
	return this.Birthday.getFullYear() +'/'+
			util.pdate(this.Birthday.getMonth()+1) +'/'+
			util.pdate(this.Birthday.getDate()) +' '+
			this.Birthday.getHours() +':'+
			util.pdate(this.Birthday.getMinutes()) +':'+
			util.pdate(this.Birthday.getSeconds());
});

UserSchema.virtual('sRegTime').get(function(){
	return this.RegTime.getFullYear() +'/'+
			util.pdate(this.RegTime.getMonth()+1) +'/'+
			util.pdate(this.RegTime.getDate()) +' '+
			this.RegTime.getHours() +':'+
			util.pdate(this.RegTime.getMinutes()) +':'+
			util.pdate(this.RegTime.getSeconds());
});

UserSchema.pre('save', function(next, done){
	next();
});

UserSchema.post('save', function(){
});

UserSchema.statics.findUsers = function(pagination, cb) {
	pagination[0] = pagination[0] || 1;

	var para3 = {
		sort: {
			RegTime: -1
		},
		skip: (pagination[0] - 1) * pagination[1],
		limit: pagination[1]
	};

	this.find(null, null, para3, function(err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

UserSchema.statics.register = function(registerInfo, cb) {
	registerInfo.Id = util.uuid(false);
	registerInfo.UserPass = util.md5(registerInfo.UserPass);
	this.create(registerInfo, function(err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

UserSchema.statics.findUserByUserName = function(userName, cb) {
	this.findOne({
		UserName: userName
	}, null, null, function (err, doc){
		if(err) return cb(err);
		if(doc) return cb(null, doc);
		cb('没有找到该用户');
	});
};

UserSchema.statics.getMenuTree = function(userId, cb) {
	Module.findModules({
		_id: 0,
		CreateTime: 0
	}, function(err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

var UserModel = mongoose.model('user', UserSchema);

exports = module.exports = UserModel;