/**
 * 作者：黄鑫
 * 日期：2013-07-22
 * 描述：路由功能
 */
define(["jquery", 
	"backbone"], function($, $backbone) {		
	/* 主Tab页，暂不用标签页 */
	var _ifr_mainTabs = $("#ifr_mainTabs");

	var _router = $backbone.Router.extend({	
        routes: {
        	"": "_showDefPage",
	        "page/*path": "_showPage"
        },
	    initialize: function() {
			//console.log("initialize");
	    },
		_showDefPage: function(){
			_ifr_mainTabs.attr("src","welcome");
		},
		_showPage: function($url){
			_ifr_mainTabs.attr("src",$url);
		}
	});
	return _router;
});
