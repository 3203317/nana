var db = require('./mongodb');
var util = require('../libs/utils');

var mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var RoleSchema = new Schema({
	Id: {
		type: String,
		unique: true,
		index: true
	},
	RoleName: {
		type: String,
		required: true
	},
	RoleDesc: {
		type: String
	},
	createTime: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false
});

RoleSchema.pre('save', function(next, done){
	next();
});

RoleSchema.post('save', function(){
});

RoleSchema.statics.findRoles = function(cb) {
	this.find(null, null, null, function(err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

RoleSchema.statics.saveNew = function(newInfo, cb) {
	newInfo.Id = util.uuid(false);
	this.create(newInfo, function(err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

RoleSchema.statics.findRoleByRoleName = function(roleName, cb) {
	this.findOne({
		RoleName: roleName
	}, null, null, function (err, doc){
		if(err) return cb(err);
		if(doc) return cb(null, doc);
		cb('没有找到该角色');
	});
};

var RoleModel = mongoose.model('role', RoleSchema);

exports = module.exports = RoleModel;