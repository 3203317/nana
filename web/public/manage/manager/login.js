if(window.top !== window.self) top.location.href = '/mg/mgr/login';

function frmSuccess(obj, fail){
	$.ajax({
		url: '/mg/mgr/login',
		type: "POST",
		dataType: "json",
		data: {
			data: JSON.stringify(obj)
		}
	}).done(function (data){
		console.log(data);
		if(!data.success) return fail(data.msg);
		location.href = '../index?locale='+ (location.search.match(/locale=([\w\-]+)/) ? RegExp.$1 : 'zh') +'#page/welcome';
	}).complete(function(){});
}

function frmFail(valiResu){
	if('string' === typeof valiResu){
		$('#alert_msg').html(valiResu);
	}else{
		$('#alert_msg').html(valiResu[0]);
		$('#loginFrm_'+ valiResu[1]).focus();
	}
}

function frmSubmit(obj, vali, fail, success){
	var valiResu = vali(obj);
	if(valiResu) return fail(valiResu);
	success(obj, fail);
}

$(function(){
	$('#btn_login').click(function(){
		var frmObj = $("#loginFrm").serializeObjectForm();
		frmSubmit(frmObj, valiLoginFrm, frmFail, frmSuccess);
	});
});