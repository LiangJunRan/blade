;(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Dom7'], factory);
	} else {
		factory(window.Dom7);
	}
}(function ($, undefined) {
	$.formb = $.formb || {};

	$.formb.components = $.formb.components || {};
	var baseComponent = $.formb.baseComponent;

	var component_textarea = function(kargs) {
		baseComponent.apply(this, arguments);

		this.template =
				'<input type="hidden" name="{name}" />' +
				'<span>图像在设计中拥有强大的力量。无论是什么主题，我们很自然地会被图片所吸引。从美丽清晰的照片，到精心设计的图形，总能第一时间捕获我们的眼球。</span>';

		this.__beforeRender = function() {
			this.opts.addonIconClass = 'right';
		}

		this.__render = function() {
			this.$node = $(this.template.format(this.opts));
			this.$node.attr('placeholder', this.opts.placeholder);
			this.$node.attr('onfocus', 'this.placeholder=""');
			this.$node.attr('onblur', 'this.placeholder="' + this.opts.placeholder + '"');
			// this.$node.attr('readonly', this.opts.readonly || false);
		}
	}

	$.formb.components.textarea = component_textarea;

}));