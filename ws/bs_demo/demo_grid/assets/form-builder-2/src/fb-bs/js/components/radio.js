;(function (factory) {
    'use strict';
     if(typeof define === "function" && define.amd) {
         define(['jquery'], factory);
     }else{
         factory(jQuery);
     }
}(function ($) {
    $.formb = $.formb || {};
    $.formb.components = $.formb.components || {};
    var baseComponent = $.formb.baseComponent;

    var component_radio = function (kargs) {
        baseComponent.apply(this, arguments);
        this.template = '<div class="component" ><div class="radio-content"></div>' +
            '<div class="help-block-error"></div>'+
            '</div>';
        this.options = '<div class="radio clip-radio radio-primary radio-inline" {isHide}><input name = "{name}" type="radio" value="{value}" class="coreInput"><label class = "itemLabel">{label}</label></div>';
        var that = this ;
        function randomId(prefix){
            return ( prefix || '' ) + ( new Date().valueOf().toString(36)+Math.random().toString(36) ).split('0.').join('_').toUpperCase();
        }
        this.__render = function() {
            if(!that.opts.isRead) {

                that.$node = $(that.template);
                $.each(that.opts.options, function (idx, obj) {
                    var random_id = randomId();
                    var hideFlag;
                    var label  = that.opts.options[idx].description !== undefined ? that.opts.options[idx].description : that.opts.options[idx].label;
                    if(that.opts.options[idx].isHide){
                        hideFlag = 'style="display:none"';
                    }else{
                        hideFlag = '';
                    }
                    var $option = $(that.options.format($.extend({}, {value:that.opts.options[idx].value,label:label,isHide:hideFlag}, {'name': that.opts.name})));
                    $option.find('input').prop('id', random_id);
                    $option.find('label').attr('for', random_id);
                    that.$node.find('.radio-content').append($option);
                });


                // 给用来存值的input对象加change监听，如果值改变，只有可能是setFormValue执行造成的
                this.$node.find('input').on('change', function (e) {
                    var value = e.target.value;
                    // that.setValue(value);
                });
            } else {
                that.$node = $(that.readTemplate.format(that.opts));
                that.$node.find('input').on('change',function () {
                    that.setValue($(this).val());
                });

            }

        }

        this.__transRead = function (){

            var $input = that.$node.find('input');
            var label = '';
            $.each($input , function (idx) {
                var $this = $(this);
                if($this.prop('checked')) {
                    $.each(that.opts.options, function (idx){
                       if(that.opts.options[idx].value == $this.val()) {
                           label = that.opts.options[idx].label;
                       }
                    });

                }

            });
            that.$node.find('.radio-content').remove();
            that.$node.append(that.readTemplate.format({value:label}));
        }

        this.__setValue = function(value) {
            if(!that.opts.isRead) {
                that.$node.find("input[value='" + value + "']").attr("checked",true);
            } else {
                var  label = '';
                $.each(that.opts.options , function (_idx) {
                    var option = that.opts.options[_idx];
                    if (value === option.value.toString()) {
                        label = option.label;
                    }
                });
                if(label === ''){
                    that.$node.attr('hidden',true);
                }else {
                    that.$node.removeAttr('hidden');
                    that.$node.attr("title", label);
                    that.$node.find('input').val(value);
                    that.$node.find('.showValue').html(label);
                }

            }

        }

    };
    $.formb.components.radio = component_radio;

}));