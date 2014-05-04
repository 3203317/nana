function valiUserRegFrm(data){
	var result = /^[a-zA-Z0-9_-]{4,20}$/.test(data.UserName);
	if(!result) return ['用户名不符合要求', 'UserName'];
	data.UserName = data.UserName.trim().toLowerCase();

	result = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+.)+[A-Za-z0-9]{2,3}$/.test(data.Email);
	if(!result) return ['电子邮箱不符合要求', 'Email'];
	data.Email = data.Email.trim().toLowerCase();

	result = /^[a-zA-Z0-9_-]{6,20}$/.test(data.UserPass);
	if(!result) return ['密码不符合要求', 'UserPass'];
}

exports.validate = valiUserRegFrm;