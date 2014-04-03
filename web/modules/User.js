var db = require('./mongodb');

function uuid(b) {
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
}

function md5(str){
	return str;
}

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
	regTime: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false
});

UserSchema.pre('save', function(next, done){
	next();
});

UserSchema.post('save', function(){
});

UserSchema.statics.findUsers = function(cb) {
	this.find(null, null, null, function(err, docs){
		if(err){
			cb(err);
			return;
		}
		cb(null, docs);
	});
};

UserSchema.statics.register = function(registerInfo, cb) {
	registerInfo.Id = uuid(false);
	registerInfo.UserPass = md5(registerInfo.UserPass);
	this.create(registerInfo, function(err, doc){
		if(err){
			cb(err)
			return;
		}
		cb(null, doc);
	});
};

UserSchema.statics.findUserByUserName = function(userName, cb) {
	this.findOne({
		UserName: userName
	}, null, null, function(err, doc){
		if(err){
			cb(err);
			return;
		}
		if(doc){
			cb(null, doc);
			return;
		}
		cb('没有找到该用户');
	});
};

var UserModel = mongoose.model('user', UserSchema);

exports = module.exports = UserModel;