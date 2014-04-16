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
	Sort: {
		type: Number
	},
	CreateTime: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false
});

ModuleSchema.virtual('sCreateTime').get(function(){
	return util.formatDate(this.CreateTime);
});

ModuleSchema.pre('save', function(next, done){
	next();
});

ModuleSchema.post('save', function(){
});

ModuleSchema.statics.saveNew = function(newInfo, cb) {
	newInfo.Id = newInfo.Id || util.uuid(false);
	this.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

ModuleSchema.statics.findModules = function(fields, cb) {
	this.find(null, fields, {
		sort: {
			Sort: 1
		}
	}, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

/**
 *
 * @method 通过父主键获取模块列表
 * @params pid 父主键
 * @return 
 */
ModuleSchema.statics.findModulesByPId = function(pid, cb) {
	if(!pid) return cb('父主键不能为空');
	pid = pid.trim();
	if(0 === pid.length) return cb('父主键不能为空');

	this.find({
		PId: pid
	}, null, {
		sort: {
			Sort: 1
		}
	}, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

var ModuleModel = mongoose.model('module', ModuleSchema);

exports = module.exports = ModuleModel;