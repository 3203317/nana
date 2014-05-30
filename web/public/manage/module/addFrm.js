function valiAddFrm(data){
	if(!data) return '参数异常';

	if(!data.PId || !/^(0|[a-zA-Z]\w{31})$/.test(data.PId)) return ['不符合格式要求。', 'PId'];
	if(!data.ModuleName || !/^\d+$/.test(data.ModuleName)) return ['模块名称不符合格式要求。', 'ModuleName'];
	if(!data.Sort || !/^\d+$/.test(data.Sort)) return ['排序不符合格式要求。', 'Sort'];
}

exports.validate = valiAddFrm;