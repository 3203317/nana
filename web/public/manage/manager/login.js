if(window.top !== window.self) top.location.href = '/manage/manager/login';

function frmDeal(valiResu){
	if('string' === typeof valiResu){
		$('#alert_msg').html(valiResu);
	}else{
		$('#alert_msg').html(valiResu[0]);
		$('#loginFrm_'+ valiResu[1]).focus();
	}
}

function frmSubmit(){
	var formObj = $("#loginFrm").serializeObjectForm();
	var valiResu = valiLoginFrm(formObj);
	if(valiResu) return frmDeal(valiResu);

	$.ajax({
		url: '/manage/manager/login',
		type: "POST",
		dataType: "json",
		data: {
			data: JSON.stringify(formObj)
		}
	}).done(function (data){
		console.log(data);
		if(!data.success) return frmDeal(data.msg);
		location.href = '../index?locale='+ (location.search.match(/locale=([\w\-]+)/) ? RegExp.$1 : 'zh') +'#page/welcome';
	}).complete(function(){});
}

$(function(){
	$('#btn_login').click(function(){
		frmSubmit();
	});
});