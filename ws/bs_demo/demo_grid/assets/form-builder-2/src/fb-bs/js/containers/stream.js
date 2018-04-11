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
    var baseComponent = $.formb.baseContainer;


    var component_stream = function (kargs) {
        baseComponent.apply(this, arguments);
        this.template = '<div class="outerClass col-sm-12 stream">' +
                                '<div class="item row formDescription form-group">' +
                                    '<div class="contentClass col-sm-10">' +
                                         '<div class="textarea-group one stream" style="display:inline-block;">{label}</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';

        this.contentTemplate = '<span class="item" item-name="{name}"></span>';

        var that = this ;

        this.__render = function() {
            // 渲染内部items
            var opt = undefined;
            var appendData = {
                label: this.opts.label,
                components: []				// 用于存放所有渲染完毕的components
            };

            //  寻找appendData.label中的{taNew}
            var reSearch = appendData.label.match((/{[^{}]*}/g));

            // // 循环查找结果，将其替换；
            $.each(reSearch, function(idx) {
                //var opts = that.opts.items;
                var name = reSearch[idx].match("{([^{}]*)}")[1];	// 去掉左右大括号的
                appendData.label = appendData.label.replace(reSearch[idx], that.contentTemplate.format({name:name}));

            });

            $.each(this.opts.items, function(idx){
                opt = that.opts.items[idx];

                var Component = $.formb.components[opt.type];

                if (Component === undefined) {
                    console.error('组件或容器[{type}]未找到对应的class定义'.format({type: opt.type}));
                }
                // 将当前$form传入下一层参数
                opt.$form = that.$form;
                var nameLabelMap = this.$form.data('nameLabelMap');
                if (nameLabelMap === undefined) {
                    nameLabelMap = {};
                }
                nameLabelMap[opt.name] = that.opts.label;
                this.$form.data('nameLabelMap', nameLabelMap);
                opt.rule = that.$form.data('fb-form').opts.rules[opt.name];
                var component = new Component(opt);
                component.render();
                appendData.components.push(component);
            });
            that.append(appendData);
            console.log(appendData);
        };

        this.__append = function(appendData) {

            // 渲染label >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            //var $labels = $(this.template.format({labels: appendData.labels}));
             var $label = $(this.template.format({label: appendData.label}));
             console.log($label);

             this.$node = [$label];

             console.log([$label]); // [l] length=1(items行数) Array[0]

             $.each(appendData.components, function(idx) {
                 var childComponent = appendData.components[idx];
                 var opts = childComponent.opts;
                 var $container = $label.find('[item-name=' + opts.name + ']');
                 if(true) {
                     // $container.addClass('symbol required')
                     // $container.css('display','inline-block');
                     // $container.css(':before','margin-right:5px')
                 }
                 // 找到指定“壳”，将渲染完的对象放入容器中
                 $container.append(childComponent.$node);
                 if(opts.rule!==undefined && opts.rule.required){

                     childComponent.$node.css('display','inline-block');
                     $container.addClass('symbol required-stream');
                 }

          //       //判断是否是只读
          //       if (childComponent.opts.isRead) {
          //           childComponent.$node.next().addClass('hide');
          //           childComponent.transRead();
          //       }


             });
        }

    };
    $.formb.components.stream = component_stream;

}));