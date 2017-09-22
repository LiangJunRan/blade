'use strict';
;(function (factory) {
	'use strict';
	if (typeof define === "function" && define.amd) {
		// AMD模式
		define(['jquery'], factory);
	} else {
		// 全局模式
		factory(jQuery);
	}
}(function ($) {
	$.formb = $.formb || {};

	$.formb.components = $.formb.components || {};
	var baseComponent = $.formb.baseComponent;

	var component_input = function(_opts) {
		baseComponent.apply(this, arguments);

		this.defaultOpts

		this.template =
				'<input type="text" class="form-control coreInput" />';
	}


}));