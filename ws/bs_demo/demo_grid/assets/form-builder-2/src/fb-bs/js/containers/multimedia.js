;(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		// AMD模式
		define(['jquery'], factory);
	} else {
		// 全局模式
		factory(jQuery);
	}
}(function ($, undefined) {
	$.formb = $.formb || {};
	$.formb.components = $.formb.components || {};
	
	var baseContainer = $.formb.baseContainer;

	var container_multimedia = function(kargs) {
		baseContainer.apply(this, arguments);

		var that = this;

		this.template = 
				'<div class="outerClass {outerWidth} multimedia">' +
					'<div class="item row formDescription form-group">' +
						'<label class="labelClass {labelWidth} form-control-static">' +
							'<span class="textRequired formLabel pull-right">{label}</span>' +
						'</label>' +
						'<div class="contentClass {contentWidth}">' +
							'<span class="childComponent"></span>' +
						'</div>' +
					'</div>' +
				'</div>';

		this.__render = function() {
			var childComponents = [];		// 用于存放所有渲染完毕的components

			$.each(this.opts.items, function(idx){
				var opt = that.opts.items[idx];

				var Component = $.formb.components[opt.type];
				if (Component === undefined) {
					console.error('组件或容器[{type}]未找到对应的class定义'.format({type: opt.type}));
				}
                // 将当前$form传入下一层参数
                opt.$form = that.$form;
                opt.rule = that.$form.data('fb-form').opts.rules[opt.name];
                var nameLabelMap = this.$form.data('nameLabelMap');
                if (nameLabelMap === undefined) {
                    nameLabelMap = {};
                }
                nameLabelMap[opt.name] = that.opts.label;
                this.$form.data('nameLabelMap', nameLabelMap);
                var component = new Component(opt);
				component.render();
				childComponents.push(component);
			});
			this.append(childComponents);
		}

		this.__append = function(childComponents) {
			this.$node = $(this.template.format({
				label: that.opts.label,
				outerWidth: that.opts.outerWidth,
				labelWidth: that.opts.labelWidth,
				contentWidth: that.opts.contentWidth
			}));

			$.each(childComponents, function(idx) {
				that.$node.find('.childComponent').append(childComponents[idx].$node);
			});
		}
	}

	$.formb.components['multimedia'] = container_multimedia;

}));