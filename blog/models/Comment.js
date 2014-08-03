var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var util = require('../lib/util');

var CommentSchema = new Schema({
	Content: {			// 内容
		type: String
	}, PostIP: {		// 提交IP
		type: String
	}, Author: {		// 作者
		type: String
	}, User_Id: {		// 用户Id
		type: ObjectId
	}, Article_Id: {	// 文章Id
		type: ObjectId
	}, PostTime: {
		type: Date
	}
}, {
	versionKey: false,
	toObject: {
		virtuals: true
	}, toJSON: {
		virtuals: true
	}
});

CommentSchema.virtual('CreateTime').get(function(){
	return (new Date(this._id.getTimestamp())).format();
});

mongoose.model('Comment', CommentSchema);