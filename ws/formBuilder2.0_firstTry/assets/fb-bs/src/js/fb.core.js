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



	var shellTemplate =
			'<div class="outerClass drag_item base">' +
				'<div class="item row formDescription form-group">' +
					'<label class="labelClass form-control-static">' +
						'<span class="textRequired formLabel pull-right"></span>' +
					'</label>' +
					'<div class="contentClass">' +
						'<div class="core"></div>' +
						'<div class="help-block-error"></div>' +
					'</div>' +
				'</div>' +
			'</div>';
	function appendTo($component, $container) {
		var $item = $(shellTemplate.format($component.data('opts')))
	}

	// 根据json渲染form的内容
	function renderJson($form, jsonConf) {
		var json_opts = jsonConf['items'];
		// var json_rules = jsonConf['rules'];

		$.each(json_opts || [], function(_idx){
			// 渲染出组件，只是组件自己，没有label之类的
			var $item = render(this);

			// 加入新对象
			// $form.append($item);
			appendTo($item, $form);

			$item.data().opts = this;
			$item.data().rule = json_rules[this.name];
		});
	}

}));