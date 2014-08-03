var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var util = require('../lib/util');

var LinkSchema = new Schema({
	LinkName: {
		type: String
	}, LinkUrl: {
		type: String
	}, Sort: {			// 排序
		type: Number
	}, User_Id: {		// 用户Id
		type: ObjectId
	}
}, {
	versionKey: false,
	toObject: {
		virtuals: true
	}, toJSON: {
		virtuals: true
	}
});

LinkSchema.virtual('CreateTime').get(function(){
	return (new Date(this._id.getTimestamp())).format();
});

mongoose.model('Link', LinkSchema);