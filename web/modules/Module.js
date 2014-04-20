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
		type: Number,
		default: 1
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

ModuleSchema.pre('save', function (next, done){
	next();
});

ModuleSchema.post('save', function(){
});

function valiEditFrm(data){
	data.Sort = data.Sort || 1;
	delete data.CreateTime;
}

ModuleSchema.statics.edit = function(newInfo, cb) {
	var valiResu = valiEditFrm(newInfo);
	if(valiResu) return cb(valiResu);

	this.update({
		Id: newInfo.Id
	}, {
		'$set': newInfo
	}, function (err, count){
		if(err) return cb(err);
		cb(null, count);
	});
};

ModuleSchema.statics.removes = function(ids, cb) {
	if(!ids || !ids.length) return cb('参数不能为空');

	this.remove({
		Id: {
			'$in': ids
		}
	}, function (err, count){
		if(err) return cb(err);
		cb(null, count);
	});
};

function valiAddFrm(data){
	data.Id = data.Id || util.uuid(false);
	data.Sort = data.Sort || 1;
	data.CreateTime = new Date();
}

ModuleSchema.statics.saveNew = function(newInfo, cb) {
	var valiResu = valiAddFrm(newInfo);
	if(valiResu) return cb(valiResu);

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

ModuleSchema.statics.findModuleById = function(id, cb) {
	if(!id) return cb('主键不能为空');

	this.findOne({
		Id: id
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc ? doc : '没有找到该记录');
	});
};

var ModuleModel = mongoose.model('module', ModuleSchema);

exports = module.exports = ModuleModel;