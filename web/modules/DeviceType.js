var db = require('./mongodb');
var util = require('../libs/utils');

var mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var DeviceTypeSchema = new Schema({
	Id: {
		type: String,
		unique: true,
		index: true
	},
	DeviceTypeName: {
		type: String,
		required: true
	},
	DeviceTypeDesc: {
		type: String
	},
	createTime: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false
});

DeviceTypeSchema.pre('save', function(next, done){
	next();
});

DeviceTypeSchema.post('save', function(){
});

DeviceTypeSchema.statics.findDeviceTypes = function(cb) {
	this.find(null, null, null, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

DeviceTypeSchema.statics.saveNew = function(newInfo, cb) {
	newInfo.Id = util.uuid(false);
	this.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

var DeviceTypeModel = mongoose.model('devicetype', DeviceTypeSchema);

exports = module.exports = DeviceTypeModel;