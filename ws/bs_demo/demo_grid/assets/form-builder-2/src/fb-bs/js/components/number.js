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

	var component_number = function(kargs) {
		// 定义默认图标
		this.componentDefaultOpts = {
			'placeholder': '--请选择--',
            'sort': 'desc'
		};
		baseComponent.apply(this, arguments);

		this.template =
				'<div class ="component">' +
            '<div class="select-content"><select name="{name}" class="form-control"></select></div>' +
            '<div class="help-block-error"></div>'+
            '</div>';
		var that = this;
		var optionsMap = {};
        var valueList = [];
		this.__render = function() {

            if(this.opts.sort==='asc') {

                var i = this.opts.minValue;
                while(i <= that.opts.maxValue) {
                    valueList.push(i);
                    i += that.opts.stepValue;
                }
            }else {
                var i = this.opts.maxValue;
                while(i>=this.opts.minValue) {
                    valueList.push(i);
                    i -= this.opts.stepValue;
                }
            }

			if(!that.opts.isRead) {

                that.$node = $(that.template.format(that.opts));

                if (that.opts.placeholder) {
                    that.$node.find('select').append('<option value="">' + that.opts.placeholder + '</option>')
                }


                if (valueList.length == 0) {
                    that.$node.find('.select-content').append('<option value="">--No-Item--</option>');
                }
                $.each(valueList,function (_idx) {
                    that.$node.find('select').append('<option value="' + valueList[_idx] + '">' + valueList[_idx] + '</option>');
                    optionsMap[valueList[_idx]] = valueList[_idx];
                });


                // 给用来存值的input对象加change监听，如果值改变，只有可能是setFormValue执行造成的
                this.$node.find('select').on('change', function (e) {
                    var value = e.target.value;
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

			var value = that.$node.find('select').val();
            that.$node.find('.select-content').remove();
            that.$node.append(that.readTemplate.format({value:value !== undefined?optionsMap[value]:''}))
        }

		this.__setValue = function(value) {
			if(!that.opts.isRead) {
                that.$node.find("option[value='"+value+"']").attr("selected",true);
            } else {


                if(value === '') {
                	that.$node.attr('hidden',true);
				} else {
                    that.$node.removeAttr('hidden');
                    that.$node.attr("title",value);
                    that.$node.find('input').val(value);
                    that.$node.find('.showValue').html(value);
				}
			}
        }


	};

	$.formb.components.number = component_number;

}));