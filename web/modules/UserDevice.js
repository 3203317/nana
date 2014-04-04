var db = require('./mongodb');
var util = require('../libs/utils');

var mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var UserDeviceSchema = new Schema({
	Id: {
		type: String,
		unique: true,
		index: true
	},
	User_Id: {
		type: String,
		required: true
	},
	DeviceName: {
		type: String,
		required: true
	},
	DeviceType_Id: {
		type: String
	},
	DeviceSys_Id: {
		type: String
	},
	DeviceVer: {
		type: String
	},
	createTime: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false
});

UserDeviceSchema.pre('save', function(next, done){
	next();
});

UserDeviceSchema.post('save', function(){
});

UserDeviceSchema.statics.findUserDevices = function(user_id, cb) {
	this.find({
		User_Id: user_id
	}, null, null, function(err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

UserDeviceSchema.statics.saveNew = function(newInfo, cb) {
	newInfo.Id = util.uuid(false);
	this.create(newInfo, function(err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

var UserDeviceModel = mongoose.model('userDevice', UserDeviceSchema);

exports = module.exports = UserDeviceModel;