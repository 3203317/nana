function valiEditFrm(data){
	if(!data) return '参数异常';

	if(!data.Id || !/^[a-zA-Z0-9]{32}$/.test(data.Id)) return ['不符合格式要求。', 'Id'];
	if(!data.RoleName || !/^[\u4E00-\u9FA5\w]{1,10}$/.test(data.RoleName)) return ['仅支持1-10位中文、数字、字母或下划线。', 'RoleName'];
}

exports.validate = valiEditFrm;