var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var util = require('../lib/util');

var ArticleSchema = new Schema({
	Title: {
		type: String,
		required: true
	}, Intro: {			// 摘要
		type: String
	}, Content: {		// 文章内容
		type: String
	}, Cate: {
		type: String,
		required: true,
		index: true
	}, Tags: {
		type: Array
	}, ViewCount: {
		type: Number,
		default: 0
	}, Bookmark: {
		type: Number,
		default: 0
	}, Topmark: {
		type: Number,
		default: 0
	}, Photo: {
		type: String
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

ArticleSchema.virtual('PostTime').get(function(){
	return this._id.getTimestamp();
});

mongoose.model('Article', ArticleSchema);