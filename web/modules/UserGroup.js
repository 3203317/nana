var db = require('./mongodb');
var util = require('../libs/utils');

var mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var UserGroupSchema = new Schema({
	Id: {
		type: String,
		unique: true,
		index: true
	},
	UserGroupName: {
		type: String,
		required: true
	},
	UserGroupDesc: {
		type: String
	},
	Create_User_Id: {
		type: String
	},
	createTime: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false
});

UserGroupSchema.pre('save', function(next, done){
	next();
});

UserGroupSchema.post('save', function(){
});

UserGroupSchema.statics.saveNew = function(newInfo, cb) {
	newInfo.Id = util.uuid(false);
	this.create(newInfo, function(err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

var UserGroupModel = mongoose.model('userGroup', UserGroupSchema);

exports = module.exports = UserGroupModel;