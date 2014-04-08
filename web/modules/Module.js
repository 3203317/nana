var db = require('./mongodb');
var util = require('../libs/utils');

var mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var ModuleSchema = new Schema({
	Id: {
		type: String,
		unique: true,
		index: true
	},
	PId: {
		type: String
	},
	ModuleName: {
		type: String,
		required: true
	},
	ModuleUrl: {
		type: String
	},
	CreateTime: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false
});

ModuleSchema.pre('save', function(next, done){
	next();
});

ModuleSchema.post('save', function(){
});

ModuleSchema.statics.saveNew = function(newInfo, cb) {
	newInfo.Id = util.uuid(false);
	this.create(newInfo, function(err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

ModuleSchema.statics.findModules = function(cb) {
	this.find(null, null, null, function(err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

var ModuleModel = mongoose.model('module', ModuleSchema);

exports = module.exports = ModuleModel;