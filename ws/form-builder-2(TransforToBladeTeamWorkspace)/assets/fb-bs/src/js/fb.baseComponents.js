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
	var baseComponent = function(kargs) {
		// params
		this.$node = undefined;
		this.$container = undefined;	// 容器对象，是否用到还不清楚……
		this.defaultOpts = {
			'opts': {},
			'rule': {}
		};
		this.template = '<div>THIS IS BASE-COMPONENT TEMPLATE</div>';
		this.opts = undefined;
		this.rule = undefined;



		// 初始化(实例化默认调用)
		this.__beforeInit = function(kargs) {
			// do nothing, not necessary
			console.log('before init');
		}
		this.__init = function(kargs) {
			// 合并配置参数
			this.opts = $.extend({}, this.defaultOpts, 
					kargs.opts, {readonly: kargs.global_isRead}, {steamLayout: kargs.global_isSteam});
			// 合并规则
			this.rule = $.extend({}, kargs.rule);
		}
		this.__afterInit = function() {
			// do nothing, not necessary
			console.log('after init');
		}
		this.init = function(kargs) {
			this.__beforeInit(kargs);
			this.__init(kargs);
			this.__afterInit(kargs);
		}
		// 自动实例化
		this.init(kargs);



		// 渲染元素的方法
		this.__beforeRender = function() {
			// do nothing, not necessary
			console.log('before render');
		}
		this.__render = function() {
			// TODO
			console.error('Must be rewritten.');
		}
		this.__afterRender = function() {
			// do nothing, not necessary
			console.log('after render');
		}
		this.render = function() {
			this.__beforeRender();
			this.__render();
			this.__afterRender();
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


	/*(function($) {

		var Animal = function(data) {
			this.__self__ = this;
			this.type = "animal";
			this.data = data;
			this.showSelf = function() {
				for (var x in this.__self__) {
					console.log('  ', x, ':', this.__self__[x]);
				}
			}
		}

		var Dog = function(data, name) {
			Animal.apply(this, arguments);
			this.subType = "dog";
			this.name = name;
			this.bark = function() {
				console.log('汪汪汪 我是' + this.name);
				console.log('汪汪汪 我是' + this.subType + '属于' + this.type);
				console.log('data=', data);
				this.showSelf();
			}
		}

		var xiaobai = new Dog('一个神奇的值', '小白');

		xiaobai.bark();

	})(window.jQuery);*/

}));