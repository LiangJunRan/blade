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

	var component_text = function(kargs) {
        this.componentDefaultOpts = {
            placeholder: ''
        };
		baseComponent.apply(this, arguments);

		this.template =
			'<div class = "component">'+
				'<span class="text-group">'+
					'<input type="text" name="{name}" width="{width}" height="{height}" ' +
					'class="form-control coreInput" placeholder="{placeholder}"/>'+
				'</span>'+
            	'<div class="help-block-error"></div>'+
			'</div>';

		var that = this ;
		this.__render = function() {
			if(!that.opts.isRead) {
                that.$node = $(that.template.format(that.opts));//配参数
                //this.$node.attr('placeholder', this.opts.placeholder);
                //this.$node.attr('onfocus', 'this.placeholder=""');
                //this.$node.attr('onblur', 'this.placeholder="' + this.opts.placeholder + '"');
                //this.$node.attr('readonly', this.opts.isRead || false);

                this.$node.find('input').on('change', function(e) {
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

			that.$node.find('span').remove();
			that.$node.append(that.readTemplate.format({value:that.value !== undefined?that.value:''}))
		}



		this.__setValue = function (value) {

			if(!that.opts.isRead) {
                that.$node.find("input").val(value);
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

		
	}

	$.formb.components.text = component_text;

}));