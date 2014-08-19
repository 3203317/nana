var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

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

LinkSchema.virtual('PostTime').get(function(){
	return this._id.getTimestamp();
});

mongoose.model('Link', LinkSchema);