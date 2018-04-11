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

	var cpts = $.formb.components;

    // form校验器
    var dropFormValidator = undefined;

	$.fn.renderForm = function(jsonConf) {
		var $form = $(this);
		// 初始化校验器
		initValidator($form);

		// 渲染生成form
		render($form, jsonConf);

		// 加校验
		setFormRules($form , jsonConf.rules);
        setGroupRules($form, jsonConf.groupRules||[]);

		// 加联动
        activeEventBinds($form,jsonConf.events);

		// 赋初值
		setFormValue($form, jsonConf.values);

	}


    // 初始化form校验器
    function initValidator($form) {
        $.validator.setDefaults({
            debug: true,
            ignore: '.ignore, :input:not([name])',	// 不去校验所有带ignore的class的输入项和没有name属性的
            errorClass: 'text-danger',
            errorPlacement: function (label, element) {
                $(label).html($(label).html().replace(/:|：/g, ''));
                $(element).closest('.component').find('.help-block-error').append(label);
            },
            highlight : function(element) {
                $(element).closest('.component').addClass('has-error');
            },
            success: function (label, element) {
                label.remove();
                $(element).closest('.has-error').removeClass('has-error');

            }
        });

        dropFormValidator = $form.validate();

        $form.on('submit', function(){
            var inputs = $(':input', $form);
            // $.each(inputs, function(idx){
            //     try {
            //         if ($(inputs[idx]).valid() == false) {
            //             var offsetTop = $(inputs[idx]).closest('.component').offset().top + ($(inputs[idx]).closest('.component').height() / 2);
            //             var halfAvailHeight = (window.screen.availHeight / 2);
            //             $("html, body").animate({
            //                 scrollTop: (offsetTop - halfAvailHeight)
            //             }, 0);
            //             return false;
            //         }
            //     } catch (e) {
            //         // do nothing
            //     }
            // });

        });
    }
	function render($form, jsonConf) {
		// 将当前渲染的form对象传入配置，作为form容器的$node对象
        var opt = $.extend({}, jsonConf, {'$node': $form, '$form': $form});
		var Component = $.formb.components[opt.type];
		if (Component === undefined) {
			console.error('组件或容器[{type}]未找到对应的class定义'.format({type: opt.type}));
		}
		var component = new Component(opt);
		component.render();
		// component.appendTo($form);
	}

	function setGroupRules ($form,groupRules) {
		//将所有参与groupRules的input绑定规则
		// case atLeastOne
		var index = 0;
        var rule_name ;
		var requireAtLeastOne = groupRules.requireAtLeastOne ;
		$.each(requireAtLeastOne || [] ,function (_idx) {
            rule_name = 'requireAtLeastOne'+index;
			index ++;//每个index都不一样
            $.validator.addMethod(rule_name,function (value, element, param) {
                var isAllNull = true;
                $.each(param , function (_idx) {
                    var $form = $(element).closest('form');
                    var values = $form.serializeJson();
                    if(values[param[_idx]] !== undefined && values[param[_idx]] !== ''){
                        isAllNull = false;
                    }
                });
                return !isAllNull;
            },function (params) {
                var label = [];
                var labelMap = $form.data('nameLabelMap');
                $.each(params , function (_idx) {
                    if(labelMap[params[_idx]] !== undefined) {
                        label.push(labelMap[params[_idx]])
                    }
                });
                return label.join(',') + '必须填一项'

            });
			var each_group = requireAtLeastOne[_idx];
			$.each(each_group , function (_i) {
				var each = each_group[_i];
				var $input = $form.find(':input[name={name}]'.format({name:each}));

				var obj = new Object();
				obj[rule_name] = each_group;
				$input.rules('add',obj);

				$input.on('keyup', function() {
                    $(event.target).closest('form').valid();
				});

			})
		})

	}
    function aa (value, element, param) {
		var isAllNull = true;
		$.each(param , function (_idx) {
			var $form = $(element).closest('form');
			var values = $form.serializeJson();
			if(values.param[_idx] !== undefined && values.param[_idx] !== ''){
                isAllNull = false;
			}
		});
		return isAllNull;
	}
	function activeEventBinds($form, ebs) {
		// 触发器名字和事件详情的map
		var triggerName_eb_map = {};
		$.each(ebs || [], function (idx) {
			triggerName_eb_map[ebs[idx].trigger] = ebs[idx];
		});
		$form.data('eventBindsMap', triggerName_eb_map);

		var eventBinds = $.formb.eventBinds;
		// 遍历绑定联动事件 初始化绑定
		$.each(ebs || [], function (idx) {
			var eb = ebs[idx];
			if (eb.eventType in eventBinds) {
				var $trigger = $form.find('[name=' + eb.trigger + ']');
				// 绑定联动事件
				$trigger.addClass('band').on(eventBinds[eb.eventType].listener, eventBinds[eb.eventType].callback);
				// 初始化触发
				$trigger.trigger(eventBinds[eb.eventType].listener);
			} else {
				console.error('事件绑定/[{ebName}]未找到对应的定义'.format({ebName: eb.eventType}));
			}
		});
	}
	// /////////////////////////////////////////////////////////////////////////////
	// 表单赋值与取值
	// /////////////////////////////////////////////////////////////////////////////
	function setFormValue($form, values) {
		// console.log('>>>length', $(':input').length);
		$(':input').trigger('change');
		$.each(values || [], function(name) {
			var value = values[name];

			var targets = $('[name=' + name + ']', $form);

			$.each(targets, function() {
				var $this = $(this);
				console.log($this[0].outerHTML + '~~~~~~');
				if (['radio', 'checkbox'].indexOf($this.attr('type')) != -1) {
					if ((!$.isArray(value) && $this.attr('value') == value) ||
						($.isArray(value) && value.indexOf($this.attr('value')) != -1)) {
						$this.prop('checked', true);
						$this.trigger('change');
					}
				} else {
					$this.val(value);
					$this.trigger('change');
				}
			});
		});
        changeContainerStatus($form);
	}

	function changeContainerStatus($form) {
        // var $inputs = $form.find('[name=' + that.opts.name + ']');
        var $containers = $form.find('.outerClass');
        $.each($containers , function (_idx) {
            var $container = $($containers[_idx]);
            var components = $container.find('.component');
            var allHidden = true;
            $.each(components, function (_idx) {
                if (!$(components[_idx]).is('[hidden]')) {
                    allHidden = false;
                }
            });
            if (allHidden) {
                $container.attr('hidden', true);
            } else {
                $container.removeAttr('hidden');
            }
		})

	}

	// 增加表单校验
	function setFormRules($form,rules) {

		//获取到所有含有name的input
		var $inputs = $form.find(':input[name]');

		$.each($inputs , function (_idx , input) {
			var $input = $($inputs[_idx]);
			var name = $input.attr('name');
			var rule = rules[name] ;
			if( rule !== undefined ) {
                $input.rules('add', rule);
			}
		});


	}





	// 扩展String类型的原生方法，提供类似java或python的format方法
	String.prototype.format = function(args) {
		var result = this;
		if (arguments.length > 0) {
			if (arguments.length == 1 && typeof (args) == "object") {
				for (var key in args) {
					if(args[key]!=undefined){
						var reg = new RegExp("({" + key + "})", "g");
						result = result.replace(reg, args[key]);
					}
				}
			}
			else {
				for (var i = 0; i < arguments.length; i++) {
					if (arguments[i] != undefined) {
						var reg = new RegExp("({[" + i + "]})", "g");
						result = result.replace(reg, arguments[i]);
					}
				}
			}
		}
		return result;
	}
    // 扩展array类型原生方法，添加obj如果是array，就让其元素合并，否则直接加入
    Array.prototype.add = function(obj) {
        var arrList = this;
        if ($.isArray(obj)) {
            $.each(obj, function(_idx) {
                arrList.push(obj[_idx]);
            });
        } else {
            arrList.push(obj);
        }
    }
    // 扩展array类型原生方法，添加如果array中含有obj，那么返回true
    Array.prototype.contains = function (obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    }

    // 序列化表格元素为JSON
    $.fn.serializeJson = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (o[this.name] == null || !o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                if (this.value === "false") {
                    o[this.name] = false;
                } else if (this.value === "true") {
                    o[this.name] = true;
                } else {
                    o[this.name] = this.value || '';
                }
            }
        });
        return o;
    }
    function addHideValue($form,json) {
        var $hide_div = $form.find('.hidden-value');
        $.each($hide_div , function (_idx) {
            var name = $($hide_div[_idx]).attr('value-name');
            var hide_value =  $($hide_div[_idx]).html();
            var array = hide_value!==''?hide_value.split(','):[];
            var show_value = json[name];
            if(show_value === undefined){
                json[name] = array;
            }else {
                if($.isArray(show_value)) {
                    var final_value =  show_value.concat(array);
                    json[name] = final_value;
                } else {
                    var c = show_value.split('');
                    var final_value = c.concat(array);
                    json[name] = final_value;
                }
            }

        });
        return json;

	}
	window.addHideValue = function ($form,json) {
        var $hide_div = $form.find('.hidden-value');
        $.each($hide_div , function (_idx) {
            var name = $($hide_div[_idx]).attr('value-name');
            var hide_value =  $($hide_div[_idx]).html();
            var array = hide_value!==''?hide_value.split(','):[];
            var show_value = json[name];
            if(show_value === undefined){
                json[name] = array;
			}else {
                if($.isArray(show_value)) {
                   var final_value =  show_value.concat(array);
                    json[name] = final_value;
                } else {
                    var c = show_value.split('');
                    var final_value = c.concat(array);
                    json[name] = final_value;
                }
			}

        })
        return json;

    }

}));