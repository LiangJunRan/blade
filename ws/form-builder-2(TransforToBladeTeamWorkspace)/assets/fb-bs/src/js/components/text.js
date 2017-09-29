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

	var component_input = function(kargs) {
		baseComponent.apply(this, arguments);

		this.template =
				'<input type="text" name="{name}" class="form-control coreInput"/>';

		this.__render = function() {
			this.$node = $(this.template.format(this.opts));
			this.$node.attr('placeholder', this.opts.placeholder);
			this.$node.attr('onfocus', 'this.placeholder=""');
			this.$node.attr('onblur', 'this.placeholder="' + this.opts.placeholder + '"');
			this.$node.attr('readonly', this.opts.readonly || false);
		}
	}

	$.formb.components.text = component_input;

}));