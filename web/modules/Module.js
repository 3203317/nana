var db = require('./mongodb'),
	mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var util = require('../libs/utils');

var modAddFrm = require('../public/manage/module/addFrm'),
	modDelFrm = require('../public/manage/module/delFrm'),
	modEditFrm = require('../public/manage/module/editFrm');

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

ModuleSchema.statics.edit = function(newInfo, cb) {
	var valiResu = modEditFrm.validate(newInfo);
	if(valiResu) return cb(null, 0, valiResu);

	delete newInfo.CreateTime;

	this.update({
		Id: newInfo.Id
	}, {
		'$set': newInfo
	}, function (err, count){
		if(err) return cb(err);
		cb(null, 1, '编辑成功', count);
	});
};

ModuleSchema.statics.removes = function(data, cb) {
	var valiResu = modDelFrm.validate(data);
	if(valiResu) return cb(null, 0, valiResu);

	this.remove({
		Id: {
			'$in': data.Ids
		}
	}, function (err, count){
		if(err) return cb(err);
		cb(null, 1, '删除成功', count);
	});
};

ModuleSchema.statics.saveNew = function(newInfo, cb) {
	var valiResu = modAddFrm.validate(newInfo);
	if(valiResu) return cb(null, 0, valiResu);

	newInfo.Id = util.uuid(false);
	newInfo.Sort = newInfo.Sort || 1;
	newInfo.CreateTime = new Date();

	this.create(newInfo, function (err, doc){
		if(err) return cb(err);
		cb(null, 1, '新模块创建成功', doc);
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
	this.findOne({
		Id: id
	}, null, null, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

var ModuleModel = mongoose.model('module', ModuleSchema);

exports = module.exports = ModuleModel;