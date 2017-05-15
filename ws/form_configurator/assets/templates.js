/*(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define('formb-templates', ['jquery', 'validation'], factory);
    } else {
        factory(window.jQuery);
    }
}(function ($, validator, undefined) {
    $.itemb = $.itemb || {};
}));*/

                /*<div class="col-sm-12 drag_item base">
                    <div class="item row dashed radius">
                        <label class="col-sm-4 form-control-static dashed">文本框：</label>
                        <div class="col-sm-8 dashed">
                            <input type="text" class="form-control" />
                        </div>
                    </div>
                </div>*/

var shellTemplate = 
	'<div class="outerClass drag_item base">' +
        '<div class="item row formDescription">' +
	        '<label class="labelClass form-control-static">' +
	        	'<span class="textRequired formLabel pull-right"></span>' +
	        '</label>' +
	        '<div class="contentClass">' +
		        '<core></core>' +
		        '<div class="help-block-error"></div>' +
	        '</div>' +
        '</div>' +
    '</div>';

var core = {}, sub = {}, opts = {};

core.text = '<input type="text" class="form-control" />';
opts.text = {
    "name": "demo_text",
    "type": "text",                         // 基本类型
    "label": "文本",
    "placeholder": "请输入文本",                // 非必填
    "description": "请输入英文、数字、下划线"
}

core.select = '<select class="form-control"></select>';
opts.select = {
    "name": "demo_select",
    "type": "select",                         // 基本类型
    "label": "下拉框",
    "placeholder": "--请选择--",                // 非必填
    "description": "未完成"
}