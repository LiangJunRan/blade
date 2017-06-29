;(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define('formc-templates', ['jquery'], factory);
	} else {
		factory(window.jQuery);
	}
}(function ($, undefined) {
	$.formc = $.formc || {};

	var templates = $.formc.templates = {};

	var shellTemplate = templates.shellTemplate = 
		'<div class="outerClass drag_item base">' +
			'<div class="item row formDescription">' +
				'<label class="labelClass form-control-static">' +
					'<span class="textRequired formLabel pull-right"></span>' +
				'</label>' +
				'<div class="contentClass">' +
					'<div class="core"></div>' +
					'<div class="help-block-error"></div>' +
				'</div>' +
			'</div>' +
		'</div>';

	var core = templates.core = {};
	var sub = templates.sub = {};
	var opts = templates.opts = {};
	var rule = templates.rule = {};

	core.text = '<input type="text" class="form-control" />';
	opts.text = {
		"name": "demo_text",
		"type": "text",						 // 基本类型
		"label": "文本框",
		"placeholder": "请输入文本",				// 非必填
		"description": "请输入英文、数字、下划线"
	};
	rule.text = {
		"required": false,
		"maxlength": 10,
		"minlength": 5
	};



	core.select = '<select class="form-control"></select>';
	opts.select = {
		"name": "demo_select",
		"type": "select",						 // 基本类型
		"label": "下拉框",
		"multiple": false,
		"placeholder": "--请选择--",				// 非必填
		"description": "请点击选择",
		"dataUrl": "",							// 填写使用Url加载待选项，否则使用options
		"options": [
			{"label": "选项1", "value": 1},
			{"label": "选项2", "value": 2},
			{"label": "选项3", "value": 3}
		]
	};
	rule.select = {
		"required": false
	};



	core.radio = '<div class="formContent"></div>';
	sub.radio =
		'<div class="radio clip-radio radio-primary radio-inline">' +
			'<input type="radio">' +
			'<label class="itemLabel"></label>' +
		'</div>';
	opts.radio = {
		"name": "demo_radio",
		"type": "radio",						 // 基本类型
		"label": "单选",
		"description": "单选描述",
		"dataUrl": "",							// 填写使用Url加载待选项，否则使用options
		"options": [
			{"label": "选项1", "value": 1},
			{"label": "选项2", "value": 2},
			{"label": "选项3", "value": 3}
		]
	};
	rule.radio = {
		"required": false
	};



	core.checkbox = '<div class="formContent"></div>';
	sub.checkbox =
		'<div class="checkbox clip-check check-primary checkbox-inline">' +
			'<input type="checkbox">' +
			'<label class="itemLabel"></label>' +
		'</div>';
	opts.checkbox = {
		"name": "demo_checkbox",
		"type": "checkbox",						 // 基本类型
		"label": "多选",
		"description": "多选描述",
		"dataUrl": "",							// 填写使用Url加载待选项，否则使用options
		"options": [
			{"label": "选项1", "value": 1},
			{"label": "选项2", "value": 2},
			{"label": "选项3", "value": 3}
		]
	};
	rule.checkbox = {
		"required": false
	};



	core.date = 
		'<span class="form-control-feedback feedback-fix">' +
			'<i class="fa fa-calendar"></i>' +
		'</span>' +
		'<input type="text" class="form-control" />';
		/*'<div class="input-group">' +
			'<span class="input-group-addon">' +
				'<i class="fa fa-calendar"></i>' +
			'</span>' +
			'<input type="text" class="form-control" />' +
			'<span class="input-group-addon btn btn-dan dataCleanBtn">' +
				'<i class="fa fa-close"></i>' +
			'</span>' +
		'</div>';*/
	opts.date = {
		"name": "demo_date",
		"type": "date",						// 基本类型
		"label": "日期",
		"placeholder": "请点击以选择日期",	// 非必填
		"description": "请点击以选择日期"
	};
	rule.date = {
		"required": false,
		"dateISO": true
	};
}));
