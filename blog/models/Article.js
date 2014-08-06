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
	}, Keys: {			// 关键字
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
	}, PostTime: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false,
	toObject: {
		virtuals: true
	}, toJSON: {
		virtuals: true
	}
});

ArticleSchema.virtual('CreateTime').get(function(){
	return (new Date(this._id.getTimestamp())).format();
});

ArticleSchema.virtual('PostTime2Month').get(function(){
	return util.pdate(this.PostTime.getMonth()+1);
});

ArticleSchema.virtual('ViewCount2Money').get(function(){
	return util.threeSeparator(this.ViewCount);
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