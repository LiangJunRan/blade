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

    var component_date = function (kargs) {
        baseComponent.apply(this, arguments);
        this.template =  '<span class="form-control-feedback feedback-fix"><i class="fa fa-calendar"></i></span>' +
            '<input type="text" class="form-control coreInput" />';
        var that = this ;
        
        this.__render = function() {
            
            that.$node = $(that.template);
            var $input = $(that.$node[1]);
            $input.attr('placeholder', that.opts.placeholder);
            
            $input.datetimepicker({
                language: 'zh-CN',
                format: 'yyyy-mm-dd',
                weekStart: 1,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0
            });
        }

    };
    $.formb.components.date = component_date;

}));