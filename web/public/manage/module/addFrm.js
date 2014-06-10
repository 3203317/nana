function valiAddFrm(data){
	if(!data) return '参数异常';
	if(!data.PId || !/^(0|[a-zA-Z0-9]{32})$/.test(data.PId)) return '不符合格式要求。';
	if(!data.ModuleName || !/^[\u4E00-\u9FA5\w]{1,10}$/.test(data.ModuleName)) return ['仅支持1-10位中文、数字、字母或下划线。', 'ModuleName'];
	if(!data.Sort || !/^\d+$/.test(data.Sort)) return ['仅支持数字。', 'Sort'];
}

exports.validate = valiAddFrm;