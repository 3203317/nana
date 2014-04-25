var db = require('./mongodb');
var util = require('../libs/utils');

var mongoose = db.mongoose,
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var UserTeamSchema = new Schema({
	Id: {
		type: String,
		unique: true,
		index: true
	},
	TeamName: {
		type: String,
		required: true
	},
	Sort: {
		type: Number,
		default: 1
	},
	User_Id: {
		type: String
	},
	CreateTime: {
		type: Date,
		default: Date.now
	},
	IsDel: {			//删除标记, 删除1, 否0
		type: Number,
		default: 0
	}
}, {
	versionKey: false
});

var UserTeamModel = mongoose.model('userteam', UserTeamSchema);

exports = module.exports = UserTeamModel;