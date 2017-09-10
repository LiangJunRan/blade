/*
	Author: kuroikenshi@sina.com
	根据数据，将制定容器填充成侧边栏菜单，带缩进可折叠
*/
;(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(window.jQuery);
	}
}(function ($, undefined) {
	// 扩展String类型的原生方法，提供类似java或python的format方法
	String.prototype.format = function(args) {
		var result = this;
		if (arguments.length > 0) {	
			if (arguments.length == 1 && typeof (args) == "object") {
				for (var key in args) {
					if(args[key]!=undefined){
						var reg = new RegExp("({" + key + "})", "g");
						result = result.replace(reg, args[key]);
					}
				}
			}
			else {
				for (var i = 0; i < arguments.length; i++) {
					if (arguments[i] != undefined) {
						var reg = new RegExp("({[" + i + "]})", "g");
						result = result.replace(reg, arguments[i]);
					}
				}
			}
		}
		return result;
	}

	$.fn.sidebar = function(_opt) {
		var default_opt = {
			"iframeId": "",
			"data": [
				{
					"text": "快速办公",
					"href": "#",
					"children": [
						{
							"text": "快速办公 1",
							"href": "#"
						}, {
							"text": "快速办公 2",
							"href": "#"
						}
					]
				}, {
					"text": "点我回到首页",
					"href": "#"
				}
			],
		};
		var opt = _opt || default_opt;

		var ul = '<ul class="nav"></ul>';
		var li = '<li><a href="{href}">{text}</a></li>';
		var dropMark = '<span>&gt;&gt;</span>';

		var $iframe = $('#' + opt.iframeId);

		function renderMenuItem ($p, data) {
			$.each(data, function(idx) {
				var d = data[idx];
				var $li = $(li.format(d));
				if ($iframe.length == 1) {
					$li.on('click', 'a', function() {
						var url = $(this).attr('href') || '#';
						if (url != '#') {
							console.log('url=', url);
							$iframe[0].contentWindow.location.href = url;
							return false;
						}
					});
				}
				if (d.children) {
					$li.find('a:eq(0)').append($(dropMark));
					var $ul = $(ul);
					var data_children = d.children;
					$ul.append(renderMenuItem($ul, data_children));
					$li.append($ul);
					// $li.find('a').attr('href', 'javascript:void(0);');
					$li.on('click', function(){
						var $this = $(event.target).closest('li');
						console.log($this[0].outerHTML);
						var $childrenContainer = $this.find('ul.nav:eq(0)');
						var childrenIsHidden = $childrenContainer.is(':hidden');
						if (childrenIsHidden) {
							$childrenContainer.show();
						} else {
							$childrenContainer.hide();
						}
					});
					$ul.hide();
				}
				$p.append($li);
				return $p;
			});
		}

		var $root = $(ul);
		$root.append(renderMenuItem($root, opt.data));

		$(this).append($root);
	}
}));