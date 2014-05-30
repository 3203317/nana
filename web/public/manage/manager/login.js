if(window.top !== window.self) top.location.href = '/manage/manager/login';

function frmSuccess(frmObj, fail){
	$.ajax({
		url: '/manage/manager/login',
		type: "POST",
		dataType: "json",
		data: {
			data: JSON.stringify(frmObj)
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

function frmSubmit(frmObj, vali, fail, success){
	var valiResu = vali(frmObj);
	if(valiResu) return fail(valiResu);
	success(frmObj, fail);
}

$(function(){
	$('#btn_login').click(function(){
		var frmObj = $("#loginFrm").serializeObjectForm();
		frmSubmit(frmObj, valiLoginFrm, frmFail, frmSuccess);
	});
});