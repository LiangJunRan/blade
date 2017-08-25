;(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(window.jQuery);
	}
}(function ($, undefined) {
	$.formc = $.formc || {};

	var templates = $.formc.templates = {};

	var shellTemplate = templates.shellTemplate = 
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

	var core = templates.core = {};
	var sub = templates.sub = {};
	var opts = templates.opts = {};
	var rule = templates.rule = {};

	core.text = '<input type="text" class="form-control coreInput" />';
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



	core.select = '<select class="form-control coreInput"></select>';
	opts.select = {
		"name": "demo_select",
		"type": "select",						 // 基本类型
		"label": "下拉单选",
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
			'<input type="radio" class="coreInput">' +
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
			'<input type="checkbox" class="coreInput">' +
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
		'<input type="text" class="form-control coreInput" />';
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




	core.multiselect = '<select class="form-control coreInput" multiple></select>';
	opts.multiselect = {
		"name": "demo_multiselect",
		"type": "multiselect",						 // 基本类型
		"label": "下拉多选",
		"placeholder": "--请选择--",				// 非必填
		"description": "请点击选择",
		"dataUrl": "",							// 填写使用Url加载待选项，否则使用options
		"options": [
			{"label": "选项1", "value": 1},
			{"label": "选项2", "value": 2},
			{"label": "选项3", "value": 3},
			{"label": "选项4", "value": 4},
			{"label": "选项5", "value": 5},
			{"label": "选项6", "value": 6}
		]
	};
	rule.multiselect = {
		"required": false
	};




	core.textarea = 
		'<textarea class="form-control coreInput"></textarea>';
	opts.textarea = {
		"name": "demo_textarea",
		"type": "textarea",						// 基本类型
		"label": "多行文本",
		"rows": 3,
		"resize": "none",
		"placeholder": "请输入文本",				// 非必填
		"description": "请输入英文、数字、下划线"
	};
	rule.textarea = {
		"required": false,
		"maxlength": 200,
		"minlength": 0
	};



	core.static = 
		'<div class="form-control-static staticContent"></div>';
	opts.static = {
		"type": "static",						// 基本类型
		"label": "静态",
		"placeholder": "静态文字内容",
		"description": "--静态文字描述--"
	};
	rule.static = {
	};



	core.image = 
		'<div class="item-input item-input-image">' +
			'<input type="hidden" name="{name}">' +
			'<div class="thumbnails-container">' +
			'</div>' +
			'<div class="thumbnails-description">{description}</div>' +
		'</div>';
	sub.image = {};
	sub.image.item =
		'<div class="thumbnail">' +
			'<div class="delete">' +
				'<i class="f7-icons">close</i>' +
			'</div>' +
			'<a class="openPhotoBrowser" href="javascript:void(0);">' +
				'<div class="image-container">' +
					'<img src="{url}" onerror="onerror=null; src=\'/assets/fw7/img/error.jpg\'"/>' +
				'</div>' +
			'</a>' +
		'</div>';
	sub.image.add =
		'<button type="button" class="button thumbnail add">' +
			'<i class="fa fa-plus"></i>' +
		'</button>';
	sub.image.waiting =
		'<div class="thumbnail waiting">' +
			'<div class="delete">' +
				'<i class="f7-icons">close</i>' +
			'</div>' +
			'<div class="preloader"></div>' +
		'</div>';
	opts.image = {
		"type": "image",
		"name": "demo_image",
		"label": "测试图片",
		"description": "请点击上传",
		"maxNumber": 5,
		"minNumber": 1
	};
	rule.image = {
		"required": false
	};
}));
