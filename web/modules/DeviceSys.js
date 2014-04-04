var db = require('./mongodb');
var util = require('../libs/utils');

var mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var DeviceSysSchema = new Schema({
	Id: {
		type: String,
		unique: true,
		index: true
	},
	DeviceSysName: {
		type: String,
		required: true
	},
	DeviceSysDesc: {
		type: String
	},
	createTime: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false
});

DeviceSysSchema.pre('save', function(next, done){
	next();
});

DeviceSysSchema.post('save', function(){
});

DeviceSysSchema.statics.findDeviceSyss = function(cb) {
	this.find(null, null, null, function(err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

DeviceSysSchema.statics.saveNew = function(newInfo, cb) {
	newInfo.Id = util.uuid(false);
	this.create(newInfo, function(err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

var DeviceSysModel = mongoose.model('deviceSys', DeviceSysSchema);

exports = module.exports = DeviceSysModel;