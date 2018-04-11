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

	var component_select = function(kargs) {
		// 定义默认图标
		this.componentDefaultOpts = {
			'placeholder': '--请选择--'
		};
		baseComponent.apply(this, arguments);

		this.template =
				'<div class ="component">' +
            '<div class="select-content"><select name="{name}" class="form-control"></select></div>' +
            '<div class="help-block-error"></div>'+
            '</div>';
		var that = this;
		var optionsMap = {};
		this.__render = function() {

			if(!that.opts.isRead) {


                that.$node = $(that.template.format(that.opts));

                if (that.opts.placeholder) {
                    that.$node.find('select').append('<option value="">' + that.opts.placeholder + '</option>')
                }
                if (that.opts.options !== undefined && that.opts.options.length > 0) {
                    $.each(that.opts.options, function (idx) {
                        var hideFlag;
                        var label  = that.opts.options[idx].description !== undefined ? that.opts.options[idx].description : that.opts.options[idx].label;
                        if(that.opts.options[idx].isHide){
                            hideFlag = 'style="display:none"';
                        }else{
                            hideFlag = '';
                        }
                        that.$node.find('select').append('<option value="{value}" {isHide}>{label}</option>'
                            .format(
                            {
                                value:that.opts.options[idx].value,
                                label:label,
                                isHide:hideFlag
                            }));
                        optionsMap[this.value] = this.label;
                    });
                } else {
                    that.$node.find('.select-content').append('<option value="">--No-Item--</option>');
                }


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
                var  label = '';
                $.each(that.opts.options , function (_idx) {
                    var option = that.opts.options[_idx];
                    if (value === option.value.toString()) {
                        label = option.label;
                    }
                });

                if(label === '') {
                	that.$node.attr('hidden',true);
				} else {
                    that.$node.removeAttr('hidden');
                    that.$node.attr("title",label);
                    that.$node.find('input').val(value);
                    that.$node.find('.showValue').html(label);
				}
			}
        }


	};

	$.formb.components.select = component_select;

}));