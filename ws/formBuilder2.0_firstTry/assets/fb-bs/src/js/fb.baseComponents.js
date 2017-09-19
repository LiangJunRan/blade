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

	// 基本组件类
	var baseComponent = function(_opts) {
		// params
		this.$node = undefined;
		this.$form = undefined;
		this.defaultOpts = {};
		this.template = '<div>THIS IS BASE-COMPONENT TEMPLATE</div>';
		this.opts = undefined;

		// 初始化(实例化默认调用)
		this.beforeInit = function(self, _opts) {
			// do nothing, not necessary
		}
		this.beforeInit(this);
		this.__init = function(_opts) {
			this.opts = $.extend({}, this.defaultOpts, _opts);
		}
		this.__init(_opts);
		this.afterInit = function(self) {
			// do nothing, not necessary
		}
		this.beforeInit(this);

		// 渲染元素的方法
		this.beforeRender = function() {
			// do nothing, not necessary
		}
		this.render = function() {
			// TODO
		}
		this.afterRender = function() {
			// do nothing, not necessary
		}

		// 配置校验规则
		this.beforeSetRule = function() {
			// do nothing, not necessary
		}
		this.setRule = function() {
			// TODO
		}
		this.afterSetRule = function() {
			// do nothing, not necessary
		}

		// 赋值的实现
		this.beforeSetRule = function() {
			// do nothing, not necessary
		}
		this.setRule = function() {
			// TODO
		}
		this.afterSetRule = function() {
			// do nothing, not necessary
		}
	}

	$.formb.baseComponent = baseComponent;


	var ParentClass = function(lastName) {
		this.lastName = lastName;
	}

	var ChildClass = function(lastName, firstName) {
		this.firstName = firstName;
	}

	ChildClass.prototype = new ParentClass();

	var child = new ChildClass('Lv', 'Yang');

	console.log(child.lastName + ' ' + child.firstName);

}));