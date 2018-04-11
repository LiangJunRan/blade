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
    $.formb.eventBinds = $.formb.eventBinds || {};
    // 对象值改变，改变其他对象的显示和隐藏状态(并禁用组件)
    $.formb.eventBinds.valueChangeShowHide = {
        listener: 'change',
        callback: function(event) {
            // 改变显示
            function checkViewStatus  ($container) {
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
            //formGroup事件绑定
            function __fromGroupEventBind ($form ,itemContainer,itemName,respNames) {
                // 当前轮询的name在本次应该显示的nameList中

                if (respNames.indexOf(itemName) != -1) {
                    itemContainer.find('.component').removeAttr('hidden');
                    // 启用存值的节点
                    $form.find('[name=' + itemName + ']').prop('disabled', false);
                } else {
                    // 隐藏存值的节点
                    itemContainer.find('.component').attr('hidden',true);

                    // 将要隐藏的组件值赋为空，并触发change事件
                    if($form.find('[name=' + itemName + ']').attr('type')!=='radio' && $form.find('[name=' + itemName + ']').attr('type')!=='checkbox'){

                        $form.find('[name=' + itemName + ']').val('').trigger('change');
                    }else {
                        if(!$form.find('[name=' + itemName + ']').is(':disabled'))
                        $form.find('[name=' + itemName + ']').trigger('change');
                    }

                    // 禁用存值的节点
                    $form.find('[name=' + itemName + ']').prop('disabled', true);
                }
                checkViewStatus(itemContainer);
            }
            //multimedia事件绑定
            function __multiMediaEventBind ($form ,itemContainer,itemName,respNames) {
                //找到每个组件的dom
                var $component = itemContainer.find('[name=' + itemName + ']').closest('.component');
                // 当前轮询的name在本次应该显示的nameList中
                if (respNames.indexOf(itemName) != -1) {
                    $component.removeAttr('hidden');
                    // 启用存值的节点
                    $form.find('[name=' + itemName + ']').prop('disabled', false);
                    console.log("123123",$component);
                } else {
                    // 隐藏存值的节点
                    $component.attr('hidden',true);

                    // 将要隐藏的组件值赋为空，并触发change事件
                    if($form.find('[name=' + itemName + ']').attr('type')!=='radio' && $form.find('[name=' + itemName + ']').attr('type')!=='checkbox'){

                        $form.find('[name=' + itemName + ']').val('').trigger('change');
                    }else {
                        if(!$form.find('[name=' + itemName + ']').is(':disabled'))
                        $form.find('[name=' + itemName + ']').trigger('change');
                    }

                    // 禁用存值的节点
                    $form.find('[name=' + itemName + ']').prop('disabled', true);
                }
                //如果全部都隐藏的话，把整个outerclass也隐藏
                var allDisable = true;
                var $allComponent = itemContainer.find('.component');
                $.each( $allComponent, function (idx) {
                    if (!$allComponent[idx].hasAttribute('hidden')) {
                        allDisable = false;
                    }
                });
                //将整个multimedia隐藏
                if(allDisable) {
                    itemContainer.attr('hidden',true);
                } else {
                    itemContainer.removeAttr('hidden');
                }
            }
            function __streamEventBind($form ,itemContainer,itemName,respNames) {
                //找到每个组件的dom
                var $component = itemContainer.find('[name=' + itemName + ']').closest('.component');
                // 当前轮询的name在本次应该显示的nameList中
                if (respNames.indexOf(itemName) != -1) {
                    $component.removeAttr('hidden');
                    // 启用存值的节点
                    $form.find('[name=' + itemName + ']').prop('disabled', false);
                } else {
                    // 隐藏存值的节点
                    $component.attr('hidden',true);

                    if($form.find('[name=' + itemName + ']').attr('type')!=='radio' && $form.find('[name=' + itemName + ']').attr('type')!=='checkbox'){
                        // 将要隐藏的组件值赋为空，并触发change事件
                        $form.find('[name=' + itemName + ']').val('').trigger('change');
                    } else {
                        if(!$form.find('[name=' + itemName + ']').is(':disabled'))
                        $form.find('[name=' + itemName + ']').trigger('change');
                    }

                    // 禁用存值的节点
                    $form.find('[name=' + itemName + ']').prop('disabled', true);
                }
                //如果全部都隐藏的话，把整个outerclass也隐藏
                var allDisable = true;
                var $allComponent = itemContainer.find('.component');
                $.each( $allComponent, function (idx) {
                    if (!$allComponent[idx].hasAttribute('hidden')) {
                        allDisable = false;
                    }
                });
                //将整个multimedia隐藏
                if(allDisable) {
                    itemContainer.attr('hidden',true);
                } else {
                    itemContainer.removeAttr('hidden');
                }
            }
            // 当前事件的触发对象
            var $this = $(event.target);
            // 作用域（form）
            var $form = $this.closest('form');
            // 当前事件触发对象的name属性
            var triggerName = event.target.name;
            // 当前事件绑定的详情
            var eb = $form.data('eventBindsMap')[triggerName];
            // 所有响应对象名
            var allResp = [];	// 一层级
            $.each(eb.valueResps, function(value){
                // 使用自定义组相加方法，是组合并，是内容直接加入组
                //将数组去重
                if(allResp.contains(value)){
                    //do nothing
                }
                else{
                    allResp.add(eb.valueResps[value])
                }
            });
            var valueRespMap = eb.valueResps;		// {触发器的value: 响应对象的name}的关系
            var triggerValues = [];					// 触发器现在的值(使用数组存储，统一格式方便操作)
            var respNames = [];						// 取得当前值对应的所有响应对象(应该显示的对象名)


            if ($this.attr('type') == 'checkbox'||$this.attr('type') == 'radio') {
                $.each($('[name=' + triggerName + ']:checked', $form), function(){
                    triggerValues.push($(this).val());
                    respNames.add(valueRespMap[$(this).val()]);
                });
            } else {

            // 整理出所有需要显示的name，放到respNames中
            triggerValues.add($this.val());		// 将触发器值转化成数组放入triggerValues
            $.each(triggerValues, function(idx) {
                respNames.add(valueRespMap[triggerValues[idx]]);
            });
            }
            console.log('Selected: [' + triggerValues.join(', ') + '], respNames:', respNames);

            // 轮询所有响应的输入项name
            $.each(allResp, function(idx){
                var itemName = allResp[idx];

                if (itemName != undefined && itemName.length > 0) {
                    //取到每个container的Dom
                    var itemContainer = $form.find('[name=' + itemName + ']').closest('.outerClass');
                    // 在这个地方我们需要判断每个container做不同的处理
                    if (itemContainer.hasClass('fromGroup')) {
                        __fromGroupEventBind($form ,itemContainer,itemName,respNames);
                    } else if (itemContainer.hasClass('multimedia')) {
                        __multiMediaEventBind($form ,itemContainer,itemName,respNames);
                    } else if (itemContainer.hasClass('stream')) {
                        __streamEventBind($form ,itemContainer,itemName,respNames);
                    }

                }
            });
        }
    }


}));
