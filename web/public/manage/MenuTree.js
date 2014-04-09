/**
 * 作者：黄鑫
 * 日期：2013-07-16
 * 描述：左侧菜单树
 */
define(["jquery",
	"dhtmlxtree_json"], function($) {
	/* 数据转树对象 */
	var _data2TreeObject = function($data,$pIdVal,$treeObj){
		var __treeItem = [];
		for(var __i_3=0,__item_3;__item_3=$data.items[__i_3];__i_3++){
			if(__item_3["PModuleId"] == $pIdVal) {
				var __item_4 = {
					id: __item_3["ModuleId"],
					text: __item_3["ModuleName"]
				};
				__treeItem.push(__item_4);

				/* 用户自定义属性 */
				var __userDataArr_4 = [];
				for(var __item_5 in __item_3){
					var __userDataObj_4 = {};
					__userDataObj_4["name"] = __item_5;
					__userDataObj_4["content"] = __item_3[__item_5];
					__userDataArr_4.push(__userDataObj_4);
				}
				__item_4["userdata"] = __userDataArr_4;

				_data2TreeObject($data,__item_4["id"],__item_4);
			}
		}
		if(__treeItem.length > 0) {
			$treeObj["item"] = __treeItem;
		}else{
			if($treeObj["item"] == null) delete $treeObj.item;
		}
	};

	/* 菜单树 */
	var _menuTree = function($params){
		var __tabbar = new dhtmlXTabBar($params.placeAt, "top");
		__tabbar.setSkin("dhx_skyblue");
		__tabbar.setImagePath(cdnPath + dhxPath +"dhtmlxTabbar/codebase/imgs/");
		__tabbar.addTab("tab1", "常用功能", "100px");
		__tabbar.addTab("tab2", "全部功能", "100px");
		__tabbar.setTabActive("tab1");

		/* 创建Tab1 */
		var _createTab2 = function($data,$tabbar){
			/* 树的根对象 */
			var __treeObj = { id: 0, item: [] };	
			_data2TreeObject($data,0,__treeObj);

			var __accord = $tabbar.cells("tab1").attachAccordion();

			/* 循环创建折叠 */
			for(var __i_3=0,__item_3;__item_3=__treeObj.item[__i_3];__i_3++){
				/* 创建折叠 */
				__accord.addItem("acc"+ __item_3["id"], __item_3["text"]);

				/* 创建树 */
				var __tree_4 = __accord.cells("acc"+ __item_3["id"]).attachTree();
				__tree_4.setImagePath(cdnPath + dhxPath +"dhtmlxTree/codebase/imgs/csh_vista/");

				/* 每个树的根节点数据对象，根数据重置 */
				var __item_4 = __treeObj.item[__i_3];
				__item_4.id = 0;
				__tree_4.loadJSONObject(__item_4);

				/* 为树注册点击事件 */
				__tree_4.setOnClickHandler(function($id){
					var __params = {
						id: $id,
						name: this.getItemText($id),
						href: this.getUserData($id, "ModuleUrl")
					};
					if(__params.name && __params.href) __event.clickMenuTree(__params);
				});
			}
			/* 展开第一个折叠 */
			if(null != __accord.base.firstChild) __accord.openItem(__accord.base.firstChild._id);	
			__accord.setEffect(true);	
		};

//		$.ajax({
//			type: "get",
//			url: "../Api.ashx?command=listUserMenuTree",
//			dataType: "json",
//			async: true,
//			data: { ts: Date.parse(new Date())/1000 },
//			beforeSend: function($xhr){
//				$xhr.overrideMimeType("text/plain;charset=utf-8");
//			}
//		}).done(function($data){
//			if($data.status == "failure"){
//				console.log($data);
//			}else if($data.status == "timeout"){
//				location.href = "login.html?locale="+ config.locale;
//			}else{			
//				_createTab2($data,__tabbar);
//			}
//		});

		/* 事件注册及返回对象 */
		var __event = {};
		var __menuTree = {
			onClick: function($fun){
				__event.clickMenuTree = $fun;
			},
			setSizes: function(){
				__tabbar._setSizes();
			}
		};
		
        _createTab2({ items: menuTree },__tabbar);
		
		return __menuTree;
	};
	return _menuTree;
});