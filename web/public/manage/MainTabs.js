/**
 * 作者：黄鑫
 * 日期：2013-04-12
 * 描述：主Tab页
 */
define(["dojo/_base/declare",
	"dijit/layout/ContentPane",
	"dojox/layout/ContentPane",
    "fore/utils/randomUrl",
    "dijit/layout/TabContainer"], function($declare, $ContentPane, $xContentPane, $randomUrl, $TabContainer) {
	return $declare("internal.main.MainTabs", $TabContainer, {
		defaultPage: "welcome.html",
		_setDefaultPageAttr: function($value){
			var __defPage = new $ContentPane({
				id: "_main_tab_def",
				title : "首页",
				content: "<iframe frameborder='0' height='100%' width='100%' src='"+ $randomUrl($value) +"' />",
				closable : false,
				adjustPaths : true,
				renderStyles : true,
				executeScripts : true
			});
			// 添加新tab页，并定位到该页面
			this.addChild(__defPage);
			this.selectChild(__defPage);
		},
		openNewTab: function($item) {
			// 判断href是否为空
			if ($item.href) {
				var __tab = dijit.byId("_main_tab_" + $item.id);
				// 判断tab页是否已经存在，存在则定位到该tab页
				if (!__tab) {
					var __param_3 = {
						id: "_main_tab_" + $item.id,
						title : $item.label,
						closable : true,
						adjustPaths : true,
						renderStyles : true,
						executeScripts : true,
						style: { padding: "0px" }
					};

					// 创建新tab页
					if($item.openMode == "inner"){
						__param_3.href = $randomUrl($item.href);
						__tab = new $xContentPane(__param_3);
					}else{
						__param_3.content = "<iframe frameborder='0' height='100%' width='100%' src='"+ $randomUrl($item.href) +"' />";
						__tab = new $ContentPane(__param_3);
					}

					/*$aspect.after(__tab,"onLoad",function(){
						setTimeout(function() {
							__tab._layout();
							__tab.resize();
						},200);
					});*/

					// 添加新tab页，并定位到该页面
					this.addChild(__tab);
				}
				this.selectChild(__tab);
			}
		},
		_removeHandles: function(){ },
		destroy: function(){
			this._removeHandles();
			this.destroyDescendants();
			this.inherited(arguments);
		}
	});
});