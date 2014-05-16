var db = require('./mongodb'),
	mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var util = require('../libs/utils');

<<<<<<< HEAD
var modAddFrm = require('../public/manage/module/addFrm');

=======
>>>>>>> fcc55d7bb512899ca1fc915e751c853dacbb4a6b
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
		cb(null, doc ? doc : '没有找到该记录');
	});
};

var ModuleModel = mongoose.model('module', ModuleSchema);

exports = module.exports = ModuleModel;