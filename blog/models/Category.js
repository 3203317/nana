var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var util = require('../lib/util');

var CategorySchema = new Schema({
	CateName: {
		type: String
	}, CateIntro: {
		type: String
	}, CateCount: {
		type: Number
	}, Sort: {
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

CategorySchema.virtual('CreateTime').get(function(){
	return (new Date(this._id.getTimestamp())).format();
});

mongoose.model('Category', CategorySchema);