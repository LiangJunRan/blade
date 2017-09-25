;(function (factory) {
	'use strict';
	if (typeof define === "function" && define.amd) {
		// AMD模式
		define(['jquery', 'jquery_validate_min'], factory);
	} else {
		// 全局模式
		factory(jQuery);
	}
}(function ($) {
	$.formb = $.formb || {};

	var cpts = $.formb.components;


	$.fn.renderForm = function(jsonConf) {
		var $form = $(this);
		// 初始化校验器
		// initValidator($form);

		// 渲染生成form
		renderJson($form, jsonConf);

		// 加校验
		// afterAllAjaxCompleteDo(deferredObjectList, setFormRules, [$form]);

		// 加联动
		// activeEventBinds($form, jsonConf.events);

		// 赋初值
		// setFormValue($form, jsonConf.values);
	}


	// 针对容器才有的方法和变量，如果做multimedia控件，也需要实现下以下方法。
	var shellTemplate =
			'<div class="outerClass drag_item base">' +
				'<div class="item row formDescription form-group">' +
					'<label class="labelClass form-control-static">' +
						'<span class="textRequired formLabel pull-right">{label}</span>' +
					'</label>' +
					'<div class="contentClass">' +
						'<div class="core"></div>' +
						'<div class="help-block-error"></div>' +
					'</div>' +
				'</div>' +
			'</div>';
	function appendTo(component, $container) {
		// 添加或替换col-sm的class
		function __addOrReplaceClass($obj, new_class) {
			var notFound = true;
			if ($obj.length != 0) {
				var list_class = $obj.attr('class').split(' ');
				$.each(list_class, function(idx) {
					if (this.indexOf('col-sm-') >= 0) {
						notFound = false;
						list_class[idx] = new_class;
					}
				});
				if (notFound) {
					list_class.push(new_class);
				}
				$obj.attr('class', list_class.join(' '));
			}
		}
		var $formGroupItem = $(shellTemplate.format(component.opts));
		$('.core', $formGroupItem).replaceWith(component.$node);
		$('.formDescription', $formGroupItem).attr('title', component.opts.description);
		__addOrReplaceClass($formGroupItem, 'col-sm-' + component.opts.outerWidth);
		__addOrReplaceClass($('.labelClass', $formGroupItem), 'col-sm-' + component.opts.labelWidth);
		__addOrReplaceClass($('.contentClass', $formGroupItem), 'col-sm-' + component.opts.contentWidth);

		$container.append($formGroupItem);
	}



	// 根据json渲染form的内容
	function renderJson($form, jsonConf) {
		var json_opts = jsonConf['items'];
		var json_rules = jsonConf['rules'];
		var global_isRead = jsonConf['isRead'];
		var global_isSteam = jsonConf['isSteam'];

		$.each(json_opts || [], function(_idx){
			// 渲染出组件，只是组件自己，没有label之类的
			var componentClass = cpts[json_opts[_idx].type];
			if (componentClass === undefined) {
				console.error('组件[{type}]未找到对应的class定义'.format({type: json_opts[_idx].type}));
			} else {
				var component = new componentClass({
					'opts': json_opts[_idx],
					'rule': json_rules[_idx],
					'global_isRead': global_isRead,
					'global_isSteam': global_isSteam
				});
				component.render();

				// 加入新对象
				appendTo(component, $form);
			}
			
		});
	}







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

}));