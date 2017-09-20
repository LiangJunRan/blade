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
			console.error('Must be rewritten.')
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
			console.error('Must be rewritten.')
		}
		this.afterSetRule = function() {
			// do nothing, not necessary
		}

		// 赋值的实现
		this.beforeSetValue = function() {
			// do nothing, not necessary
		}
		this.setValue = function() {
			// TODO
			console.error('Must be rewritten.')
		}
		this.afterSetValue = function() {
			// do nothing, not necessary
		}
	}

	$.formb.baseComponent = baseComponent;


	(function($) {

		var Animal = function() {
			this.__self__ = this;
			this.type = "animal";
			this.showSelf = function() {
				for (var x in this.__self__) {
					console.log('  ', x, ':', this.__self__[x]);
				}
			}
		}

		var Dog = function() {
			this.subType = "dog";
			this.bark = function() {
				console.log('汪汪汪');
				this.showSelf();
			}
		}

		Dog.prototype = new Animal();
		Dog.prototype.constructor = Dog;

		var xiaobai = new Dog();

		xiaobai.bark();
	})(window.jQuery);

}));