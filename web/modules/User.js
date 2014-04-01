var db = require('./mongodb');

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
		type: String
	},
	Sex: {
		type: Number
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

UserSchema.statics.register = function(cb, registerInfo) {
};

var UserModel = mongoose.model('user', UserSchema);

exports = module.exports = UserModel;