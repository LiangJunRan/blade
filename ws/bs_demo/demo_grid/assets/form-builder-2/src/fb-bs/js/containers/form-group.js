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

	var container_formGroup = function(kargs) {
		baseContainer.apply(this, arguments);

		var that = this;

		this.template = 
					'<div class="outerClass {outerWidth} fromGroup">' +
					'<div class="item row formDescription form-group">' +
						'<label class="labelClass {labelWidth} form-control-static">' +
							'<span class="textRequired formLabel pull-right">{label}</span>' +
						'</label>' +
						'<div class="contentClass {contentWidth}">' +
							'<div class="childComponent"></div>' +
						'</div>' +
					'</div>' +
				'</div>';

		this.__render = function() {
			// 渲染内部items
			var opt = undefined;
			if (this.opts && this.opts.items) {
				if ($.isArray(this.opts.items) && this.opts.items.length == 1) {
					opt = this.opts.items[0];
				} else if ($.isArray(this.opts.items) && this.opts.items.length != 1) {
					console.warn('form-group的items应该为1或者是一个对象，请检查:', this.opts.items);
				} else {
					opt = this.opts.items;
				}
			}
            // 将当前$form传入下一层参数
            opt.$form = this.$form;
			var Component = $.formb.components[opt.type];
            opt.rule = this.$form.data('fb-form').opts.rules[opt.name];
			if (Component === undefined) {
				console.error('组件或容器[{type}]未找到对应的class定义'.format({type: opt.type}));
			}
            var nameLabelMap = this.$form.data('nameLabelMap');
            if (nameLabelMap === undefined) {
                nameLabelMap = {};
            }
            nameLabelMap[opt.name] = this.opts.label;

            this.$form.data('nameLabelMap', nameLabelMap);
			var component = new Component(opt);
			component.render();

			/*//测试setvalue方法是否有效，这段代码没有任何意义
			if(opt.test){ //如果需要测试
				component.setValue(opt.test);
			}
			if(opt.isRead){
				component.transRead();
			}*/



			this.append(component);
		}

		this.__append = function(childComponent) {
			// var opts = childComponent.opts; 	// 子组件的配置

			// TODO: 单体isSteam、isRead渲染

			this.$node = $(this.template.format(that.opts));	// 渲染自己的节点

			this.$node.find('.childComponent').replaceWith(childComponent.$node);	// 加入子组件
		}
	}

	$.formb.components['form-group'] = container_formGroup;

}));