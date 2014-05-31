$('.form_date').datetimepicker({
	language:  'zh-CN',
	weekStart: 1,
	todayBtn:  1,
	autoclose: 1,
	todayHighlight: 1,
	startView: 2,
	minView: 2,
	forceParse: 0
});

$('#addFrm_btn_submit').click(function(){
	$('#addFrm').olxForm('submit', [valiAddFrm, null, function (data){
		if(300 === data.code) return top.location.href = '/manage/user/login';
		if(!data.success) return alert(data.msg);
		location.reload();
	}]);
});

$('#btn_edit').click(function(){
	var vals = $('#table1').olxGrid('getCheckedRowsValue', 1);
	if(1 !== vals.length) return $('#editAlertModal').modal();
	var id = vals[0];

	$.ajax({
		url: id,
		type: 'GET',
		dataType: 'json'
	}).done(function (data) {
		if(300 === data.code) return top.location.href = '/manage/user/login';
		if(!data.success) return alert(data.msg);

		$('#editModal').modal();

		var data = data.data;
		$('#editFrm_Id').val(id);
		$('#editFrm_RoleName').val(data[0].RoleName);
		$('#editFrm_RoleDesc').val(data[0].RoleDesc);
		$('#editFrm_shadow_StartTime').val(data[1].StartTime);
		$('#editFrm_shadow_EndTime').val(data[1].EndTime);
		$('#editFrm_shadow_CreateTime').val(data[1].CreateTime);
	});
});

$('#delConfirmModal').on('show.bs.modal', function (e) {
	var vals = $('#table1').olxGrid('getCheckedRowsValue', 1);
	if(!vals.length) {
		$('#delAlertModal').modal();
		return e.preventDefault();
	}
})

/* 绑定删除按钮，弹出提示对话框或确认对话框 */
$('#btn_del').click(function(){
	$('#delConfirmModal').modal();
});

$('#delConfirmModal_btn_submit').click(function(){
	var selIds = $('#table1').olxGrid('getCheckedRowsValue', 1);
	var data = {
		Ids: selIds
	};
	var valiResu = valiDelFrm(data);
	if(valiResu) return alert(valiResu);

	$.ajax({
		url: 'del',
		type: 'POST',
		dataType: 'json',
		data: {
			data: JSON.stringify(data)
		}
	}).done(function (data) {
		if(300 === data.code) return top.location.href = '/manage/user/login';
		if(!data.success) return alert(data.msg);
		location.reload();
	});
});

$('#editFrm_btn_submit').click(function(){
	$('#editFrm').olxForm('submit', [valiEditFrm, null, function (data){
		if(300 === data.code) return top.location.href = '/manage/user/login';
		if(!data.success) return alert(data.msg);
		location.reload();
	}]);
});