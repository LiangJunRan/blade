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
		$baseNode = $(this);
		var default_opt = {
			"tabsId": "",
			"tabsContentId": "",
			// "iframeId": "",
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
		var dropMark = '<span class="caret"></span>';

		// var $iframe = $('#' + opt.iframeId);

		// 标签容器模板
		var tmp_tabContainer = '<ul class="nav nav-tabs sidebar-tabs"></ul>';
		// 标签对象模板
		var tmp_tabItem =
			'<li link="{hrefId}">' +
				'<a href="#tab_{hrefId}" data-toggle="tab">' +
					// '<span class="tab-icon"><i class="{iconClass}"></i></span>' +	// 图标
					'<span class="tab-title">{tabTitle}</span>' +
					'<span class="tab-btns">' +
						'<span class="tab-refresh-btn"><i class="fa fa-refresh"></i></span> ' +
						'<span class="tab-close-btn"><i class="fa fa-close"></i></span>' +
					'</span>' +
				'</a>' +
			'</li>';
		// 初始化标签容器
		var $tabs = $('#' + opt.tabsId);
		var $tabContainer = $(tmp_tabContainer);
		$tabs.append($tabContainer);


		// 标签页内容容器模板
		var tmp_tabsContentContainer = '<div id="myTabContent" class="tab-content" style="height: 100%;"></div>';
		// 标签页内容对象模板
		var tmp_tabContentItem = '<iframe src="{href}" frameborder="0" class="tab-pane fade" id="tab_{hrefId}"></iframe>';
		// 初始化标签页容器
		var $tabsContent = $('#' + opt.tabsContentId);
		var $tabsContentContainer = $(tmp_tabsContentContainer);
		$tabsContent.append($tabsContentContainer);


		function encodeHrefId(href) {
			var hrefId = href.replace(/\//g, '_slash_');
			hrefId = hrefId.replace(/\&/g, '_and_');
			hrefId = hrefId.replace(/\?/g, '_qmark_');
			hrefId = hrefId.replace(/\:/g, '_maohao_');
			hrefId = hrefId.replace(/\./g, '_dot_');
			return hrefId;
		}
		function decodeHrefId(hrefId) {
			var href = hrefId.replace(/_slash_/g, "/");
			href = href.replace(/_and_/g,"&");
			href = href.replace(/_qmark_/g, "?");
			href = href.replace(/_maohao_/g, ":");
			href = href.replace(/_dot_/g, ".");
			return href;
		}


		function renderMenuItem ($p, data) {
			$.each(data, function(idx) {
				var d = data[idx];
				var $li = $(li.format(d));

				$li.on('click', 'a', function() {
					console.log($(event.target)[0].outerHTML);
					// 更新菜单高亮
					$('.active').removeClass('active');
					if (event.target.getAttribute('href') != '#') {
						$('a[href="' + event.target.getAttribute('href') + '"]').addClass('active');
					}

					var url = $(this).attr('href') || '#';
					if (url != '#') {
						console.log('url=', url);
						// $iframe[0].contentWindow.location.href = url;

						// 增加或切换tab
						$tabs.find('.active').removeClass('active');

						var href = event.target.getAttribute('href');
						var hrefId = encodeHrefId(href);
						var $tabItem = $tabContainer.find('li[link="' + hrefId + '"]');
						var found = ($tabItem.length != 0);

						// 存在，激活
						if (found) {
							// 切换标签
							$tabItem.find('a').tab('show');
						}
						// 如果tabs里不存在，新建
						else {
							var $tabItem = $(tmp_tabItem.format({
								hrefId: hrefId,
								tabTitle: d.text
							}));
							$tabContainer.append($tabItem);

							var $tabContentItem = $(tmp_tabContentItem.format({
								hrefId: hrefId,
								href: href
							}));
							$tabsContentContainer.append($tabContentItem);
							// 切换标签
							$tabItem.find('a').tab('show');

							// 绑定标签与菜单的联动
							$tabItem.click(function() {
								var $this = $(this);
								console.log(this.outerHTML);

								var href = decodeHrefId($this.attr('link'));

								// 更新菜单高亮
								$('.active').removeClass('active');
								$('a[href="' + href + '"]').addClass('active');
							});

							// 绑定关闭事件
							$tabItem.find('.tab-close-btn').click(function() {
								$tabContentItem.remove();
								$tabItem.remove();
								var llen = $('li[link]').length;
								if (llen != 0) {
									$('li[link]:eq(' + (llen - 1) + ') a').tab('show');
								}
							});

							// 绑定刷新事件
							$tabItem.find('.tab-refresh-btn').click(function() {
								// 不支持跨域
								document.getElementById("tab_" + hrefId).contentWindow.location.reload(true);
							});
						}

						return false;
					}
				});

				// 渲染下一层
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

		$root.addClass('side-menu-root');

		$(this).append($root);
	}
}));