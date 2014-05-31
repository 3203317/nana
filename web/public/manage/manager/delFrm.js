function valiDelFrm(data){
	if(!data) return '参数异常';

	if(!data.Ids || !data.Ids.length) return '参数不能为空';
}

exports.validate = valiDelFrm;