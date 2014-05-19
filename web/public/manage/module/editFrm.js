function valiEditFrm(data){
	if(!data) return '参数异常';

	if(!data.Id || !/^[a-zA-Z]\w{31}$/.test(data.Id)) return ['不符合格式要求。', 'Id'];
	if(!data.PId || !/^(0|[a-zA-Z]\w{31})$/.test(data.PId)) return ['不符合格式要求。', 'PId'];
}

exports.validate = valiEditFrm;