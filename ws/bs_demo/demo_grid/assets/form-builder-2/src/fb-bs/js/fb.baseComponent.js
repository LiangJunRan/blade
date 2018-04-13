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
    var baseComponent = function (kargs) {
        var that = this;
        // params
        this.$node = undefined;
        this.$container = undefined;	// 容器对象，是否用到还不清楚……联动时使用？？
        this.defaultOpts = {
            'f7-icon': 'star'
        };
        this.template = '<div>THIS IS BASE-COMPONENT TEMPLATE</div>';
        this.readTemplate = '<div class="component form-control-static" title=""><input type="hidden" name="{name}" ><span class="showValue"></span></div>';
        this.opts = undefined;
        this.rule = undefined;
        this.value = undefined;
        this.groupId = undefined;


        // 初始化(实例化默认调用)
        this.__beforeInit = function (kargs) {
            // do nothing, not necessary
            console.log('before init');
        }
        this.__init = function (kargs) {
            //取到全局的只读参数
            var global_isRead = {isRead: kargs.$form.data('fb-form').opts.isRead || false};
            // 合并默认参数
            this.defaultOpts = $.extend({}, this.defaultOpts, this.componentDefaultOpts);
            // 合并配置参数
            this.opts = $.extend({}, this.defaultOpts, global_isRead, kargs);
            // 合并规则
            this.rule = $.extend({}, kargs.rule);
            // 赋初值
            this.value = kargs.value || undefined;
            // 取groupId
            this.groupId = kargs.groupId || 'default';
        }
        this.__afterInit = function () {
            // do nothing, not necessary
            console.log('after init');
            console.log('opts', this.opts);
            // console.log('rule', this.rule);
            // console.log('value', this.value);
        }
        this.init = function (kargs) {
            this.__beforeInit(kargs);
            this.__init(kargs);
            this.__afterInit(kargs);
        }
        // 自动实例化
        this.init(kargs);


        // 渲染元素的方法
        this.__beforeRender = function () {
            // do nothing, not necessary
            console.log('before render');
        }
        this.__render = function () {
            // TODO
            console.error('Must be rewritten.');
        }
        this.__afterRender = function () {
            // do nothing, not necessary
            console.log('after render');
        }
        this.render = function () {
            this.__beforeRender();
            this.__render();
            this.__afterRender();

            // 给$node绑定获取component对象的方法
            // this.$node.data('component', that);
        }

        //判断value值
        this.hasValue = function () {

        }

        // 切换只读模式方法
        this.__beforeTransRead = function () {

            // do nothing, not necessary
        }
        this.__transRead = function () {
            // TODO
            console.error('Must be rewritten.')
        }
        this.__afterTransRead = function () {
            // do nothing, not necessary

        }

        this.transRead = function () {
            this.__beforeTransRead();
            this.__transRead();
            this.__afterTransRead();
        }
        // 配置校验规则
        this.beforeSetRule = function () {
            // do nothing, not necessary
        }
        this.setRule = function () {
            // TODO
            console.error('Must be rewritten.')
        }
        this.afterSetRule = function () {
            // do nothing, not necessary
        }


        // 改变显示状态
        this.checkViewStatus = function () {
            var $inputs = this.opts.$form.find('[name=' + that.opts.name + ']');
            var $container = this.$node.closest('.outerClass');
            var components = $container.find('.component');
            var allHidden = true;
            $.each(components, function (_idx) {
                if (!$(components[_idx]).is('[hidden]')) {
                    allHidden = false;
                }
            });
            if (allHidden && !$container.hasClass('stream')) {
                $container.attr('hidden', true);
            } else {
                $container.removeAttr('hidden');
            }
        }

        //增加label必填星星,stream自定义
        this.addSimpleLabel = function () {
            var $container = this.$node.closest('.outerClass');
            var rules = that.opts.rule || {};
            var required = rules.required;

            if (!$container.hasClass('stream')) {
                var label = $container.find('.labelClass').find('.formLabel');
                if (required) {
                    console.log('AAAAAAAAA, add');
                    label.addClass('symbol required')
                } else {
                    console.log('AAAAAAAAA, rme');
                    label.removeClass('symbol required');
                }
            } else { //stream

            }
        }

        // 赋值的实现
        this.__beforeSetValue = function () {
            // do nothing, not necessary
        }
        this.__setValue = function (value) {
            // TODO
            console.error('Must be rewritten.');
        }
        this.__afterSetValue = function () {
            // do nothing, not necessary
        }
        this.setValue = function (value) {
            this.__beforeSetValue();
            this.__setValue(value);
            this.value = value;
            this.__afterSetValue();
            if (that.opts.isRead)
                this.checkViewStatus();
            this.addSimpleLabel();
        }

        // 编辑当前对象的回调
        this.editCallback = function (e) {
            console.log('Need be rewritten.');
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
            th

            is.subType = "dog";
            this.name = name;
            this.bark = function() {
                // console.log('汪汪汪 我是' + this.name);
                // console.log('汪汪汪 我是' + this.subType + '属于' + this.type);
                // console.log('data=', data);
                this.showSelf();
            }
        }

        var xiaobai = new Dog('一个神奇的值', '小白');

        xiaobai.bark();

    })(window.jQuery);*/

}));