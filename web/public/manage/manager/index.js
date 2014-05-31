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
		$('#editFrm_UserName').val(data[0].UserName);
		$('#editFrm_Sex').val(data[0].Sex);
		$('#editFrm_CreateTime').val(data[1].CreateTime);
		$('#editFrm_shadow_CreateTime').val(data[1].CreateTime);
	});
});