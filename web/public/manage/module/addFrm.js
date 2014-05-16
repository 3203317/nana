function valiAddFrm(data){
	if(!data) return '参数异常';

	if(!data.PId || !/^(0|[a-zA-Z]\w{31})$/.test(data.PId)) return ['不符合格式要求。', 'PId'];
}

exports.validate = valiAddFrm;