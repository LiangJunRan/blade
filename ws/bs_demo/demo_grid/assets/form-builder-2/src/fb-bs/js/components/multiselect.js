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

    var that = this;
    var component_multiselect = function(kargs) {
        // 定义默认图标
        this.componentDefaultOpts = {
            'placeholder': '--请选择--'
        };
        baseComponent.apply(this, arguments);
        var that = this;
        this.template =
            '<div class = "component">' +
            '<div class="hidden-value" value-name="{name}" style="display: none"></div>'+
            '<div class="select"><select name="{name}" class="form-control coreinput multiselect" size="2"  multiple></select></div>' +
            '<div class="help-block-error"></div>'+
            '</div>';

        this.__render = function() {


            if(!that.opts.isRead) {

                that.$node = $(that.template.format(that.opts));
                var $select = that.$node.find('select');


                // if (that.opts.placeholder) {
                //     that.$node.append('<option value="">' + that.opts.placeholder + '</option>')
                // }

                if (that.opts.options !== undefined && that.opts.options.length > 0) {
                    $.each(that.opts.options, function () {
                        var label ='';
                        if(this.description) {
                            label = this.description;
                        } else {
                            label = this.label;
                        }
                        if(this.isHide) { //
                            var hide_value = that.$node.find('.hidden-value').html();
                            var array = hide_value!==''?hide_value.split(','):[];
                            var value = that.opts.$form.data('fb-form').opts.values[that.opts.name] || [];
                            if(!$.isArray(value)){
                                value = value.split(',');
                            }
                            if(value.indexOf(this.value.toString())!==-1) { // 证明有值
                                array.push(this.value);
                            }
                            that.$node.find('.hidden-value').html(array.toString()) // 将旧版的值加进来


                        } else {
                            $select.append('<option value="' + this.value + '" style="display: none">' + label + '</option>');
                        }
                    });
                } else {
                    $select.append('<option value="">--No-Item--</option>');
                }


                $select.multiselect({
                    dropRight: true,
                    buttonContainer: '<div class="btn-group" style="width:100%;"/>',
                    nonSelectedText: that.opts.placeholder || '--请选择--',
                    templates: {
                        button:
                        '<button type="button" class="multiselect dropdown-toggle btn-block" data-toggle="dropdown" ' +
                        'style="text-align: left; padding-left: 16px; white-space:nowrap; text-overflow:ellipsis; ' +
                        'overflow:hidden;">' +
                        '<span class="multiselect-selected-text"></span>' +
                        '</button>',
                        ul: '<ul class="multiselect-container dropdown-menu" style="width: 100%;"></ul>'
                    }
                });

                $select.on('change', function () {

                    $(this).multiselect('refresh');

                    that.addSimpleLabel();

                    $(this).trigger('keyup');
                });
            } else {
                that.$node = $(that.readTemplate.format(that.opts));
                that.$node.find('input').on('change',function () {
                    that.setValue($(this).val());
                });
            }

        }


        this.__transRead = function() {

            //取得select的value值
            var value = that.$node.find('select').val();
            var label = [];
            $.each(that.opts.options , function (idx) {
                if (value.indexOf(that.opts.options[idx].value.toString()) != -1) {
                    label.add(that.opts.options[idx].label);
                }
            });
            that.$node.find('.select').remove();
            that.$node.append(that.readTemplate.format({value: label.join(',')}));

        }

        this.__setValue = function(value) {
            if(!that.opts.isRead) {

                if (value === '') {
                    value = [];
                }
                that.$node.find('select').val(value).trigger('change');
            }else {
                var label = [];

                if(value !== undefined) {

                    if($.isArray(value)){

                    } else {
                        value = value.split(",");
                    }

                    $.each(that.opts.options, function (_idx) {
                        if(value.indexOf(that.opts.options[_idx].value.toString()) != -1) {

                            if(that.opts.options[_idx].description) {
                                label.add(that.opts.options[_idx].description);
                            }else{
                                label.add(that.opts.options[_idx].label);
                            }
                        }

                    });
                    if(label.length == 0) {
                        this.$node.attr('hidden',true);
                    } else {
                        this.$node.removeAttr('hidden', true);
                        var finalLabel = label.join(',');
                        that.$node.attr("title",finalLabel);
                        that.$node.find('input').val(value);
                        that.$node.find('.showValue').html(finalLabel);
                    }

                }
            }
        }


    };



    $.formb.components.multiselect = component_multiselect;

}));