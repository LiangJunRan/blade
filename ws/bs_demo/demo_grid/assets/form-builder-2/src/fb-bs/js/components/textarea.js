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

	var component_textarea = function(kargs) {
		this.componentDefaultOpts = {
			rows: 4
		};

		baseComponent.apply(this, arguments);

		this.template =
            '<div class = "component">' +
				'<span class="textarea-group">' +
					'<textarea name="{name}" class="form-control" rows="{rows}" style="resize: none;"></textarea>'+
             	'</span>' +
           		'<div class="help-block-error"></div>' +
			'</div>';


		var that = this ;
		this.__render = function() {
			if(!that.opts.isRead) {
                that.$node = $(that.template.format(that.opts));
                //this.$node.css({
                //	resize: this.opts.resize || "none"//没有对浏览器窗口进行调整
                //})
                this.$node.find('textarea').on('change', function(e) {//设置监听事件
                    var value = e.target.value;
                    // console.log('value ->', value);
                    that.setValue(value);
                });
			} else {
                that.$node = $(that.readTemplate.format(that.opts));
                that.$node.find('input').on('change',function () {
                    that.setValue($(this).val());
                });
			}

		}

		this.__transRead = function () {

			var value = that.$node.find("textarea").val();
			that.$node.find('span').remove();
			that.$node.append(that.readTemplate.format({value:value !== undefined?value:''}))
		}


		this.__setValue = function (value){

			if(!that.opts.isRead) {
                that.$node.find("textarea").val(value);
            } else {
                if(value === '') {
                    that.$node.attr('hidden',true);
                } else {
                    that.$node.removeAttr('hidden');
                    that.$node.attr("title",value);
                    that.$node.find('textarea').val(value);

                }
			}

		}
	};

	$.formb.components.textarea = component_textarea;

}));