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
		type: String
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

ArticleSchema.virtual('aTags').get(function(){
	if(0 === this.Tags.length) return;

	var strs = this.Tags.split(',');
	var result = [];

	for(var s in strs){
		if('' !== strs[s]){
			result.push({
				'TagName': strs[s]
			});
		}
	}
	return result;
});

mongoose.model('Article', ArticleSchema);