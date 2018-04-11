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

	// 基本组件类
	var baseContainer = function(kargs) {
		var that = this;
		// params
		this.$node = undefined;
		this.defaultOpts = {
			'label': '容器LABEL',
			'type': 'base-container',

			'outerWidth': 'col-sm-12',
			'labelWidth': 'col-sm-3',
			'contentWidth': 'col-sm-9'
		};
		this.template = '<div>THIS IS BASE-CONTAINER TEMPLATE</div>';
		this.opts = undefined;
		this.groupId = undefined;
        this.$form = undefined;		// 自动表单的表单对象，绑定许多参数和事件用，方便调度


		// 初始化(实例化默认调用)
		this.__beforeInit = function(kargs) {
			// do nothing, not necessary
			console.log('before init');
		}
		this.__init = function(kargs) {
			// 合并配置参数
			this.opts = $.extend({}, this.defaultOpts, kargs,
				{readonly: kargs.global_isRead}, {steamLayout: kargs.global_isSteam});
			// 取groupId
			this.groupId = kargs.groupId || undefined;
            // 如果指定了$node和$form就用指定的
			this.$node = kargs.$node || undefined;
            this.$form = kargs.$form || undefined;
		}
		this.__afterInit = function() {
			// do nothing, not necessary
			console.log('after init');
			console.log('opts', this.opts);
			// console.log('groupId', this.groupId);
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



		// 向父元素添加对象的方法
		this.__beforeAppend = function(obj) {
			// do nothing, not necessary
			console.log('before Append');
		}
		this.__append = function(obj) {
			// DO
			console.error('__append() must be rewritten.');
		}
		this.__afterAppend = function(obj) {
			// do nothing, not necessary
			console.log('after Append');
		}
		this.append = function(obj) {
			this.__beforeAppend(obj);
			this.__append(obj);
			this.__afterAppend(obj);
		};
	}

	$.formb.baseContainer = baseContainer;

}));