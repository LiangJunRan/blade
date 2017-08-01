;(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Dom7'], factory);
	} else {
		factory(window.Dom7);
	}
}(function ($) {
	// /////////////////////////////////////////////////////////////////////////////
	// 全局变量 - Global Parameters
	// /////////////////////////////////////////////////////////////////////////////
	$.formb = $.formb || {};
	// var shellTemplate = $.formc.templates.shellTemplate;
	var core = $.formc.templates.core;
	var sub = $.formc.templates.sub;
	var opts = $.formc.templates.opts;
	var rule = $.formc.templates.rule;

	// 调试模式开关
	var debug_mode = false;

	// form校验器
	var dropFormValidator = undefined;

	// 延迟类的list
	var deferredObjectList = [];

	// 调试打印日志方法
	function log() {
		if (debug_mode) {
			// log = console.log;
			log = rLog;
		}
	}

	// 格式化html、js、json
	function formatCode(code) {
		js_source = code.replace(/^\s+/, '');
		tabsize = 4;
		tabchar = ' ';
		if (tabsize == 1) {
			tabchar = '\t';
		}
		var fmt_code = '';
		if (js_source && js_source.charAt(0) === '<') {
			code = style_html(js_source, tabsize, tabchar, 80);
		} else {
			code = js_beautify(js_source, tabsize, tabchar);
		}
		return code;
	}

	function rLog() {
		var msg = '';
		for (var i = 0; i < arguments.length; i++) {
			msg += formatCode(JSON.stringify(arguments[i])) + '\n\n\n';
		}
		$('.log').append('<pre>' + msg + '</pre><hr>');
	}

	

	// TODO: 校验
	$.fn.renderForm = function(jsonConf) {
		var $form = $(this);

		// 渲染生成form
		var jsonOpts = jsonConf['items'];
		$.each(jsonOpts || [], function(_idx){
			var $item = render(jsonOpts[_idx]);
			// 加入新对象
			addToForm($item, $form);
		});

		// 加联动
		activeEventBinds($form, jsonConf.events);

		// 加规则
		setFormRules($form, jsonConf.rules);

		// 赋初值
		setFormValue($form, jsonConf.values);

		// 只读模式的实现
		if (jsonConf.isRead) {
			transRead($form);
		}
	}

	// 新表单项加入表单的特殊处理
	function addToForm($item, $form) {
		var $lastChildNode = $form.find(':last-child');
		// 可以加入到list-block中的对象
		if (['text', 'select', 'multiselect', 'textarea'].indexOf($item.data('opts').type) != -1) {
			// 前节点不存在，或者存在，但不是list-block，新建list-block外壳
			if (
				// 上一个子节点不存在 或
				($lastChildNode.length == 0) || 
				// 上一个子节点不是list-block
				(!$lastChildNode.is('.list-block'))
			) {
				$lastChildNode = $(
					'<div class="list-block">' +
						'<ul></ul>' +
					'</div>');
				$form.append($lastChildNode);
			}
			var $ul = $lastChildNode.children('ul');
			var $li = $('<li class="listNode"></li>');
			$li.append($item);
			$ul.append($li);
		}
		// TODO
		else {
			console.warn($item.data('opts').type, 'is NOT support now');
		}
	}

	// 每个节点渲染的方法
	function render(opt, _$node, isRead) {
		var isNew = !(_$node);
		var $node = _$node || $((core[opt.type] || '').format(opt));

		// case by type
		switch (opt.type) {
			// 下拉框
			case 'select':
			case 'multiselect':
				if (opt.type == 'multiselect') {
					$node = _$node || $(core['select'].format(opt));
					$node.find('select').prop('multiple', true);
				}
				var $select = $node.find('select');
				if (!isNew) {
					$select.empty();
				}
				if (opt.placeholder) {
					if (opt.type == 'multiselect') {
						$select.on('change', function(e) {
							if ($select.val().length == 0) {
								// 利用timeout0将方法滞后执行
								setTimeout(function(){
									$node.find('.item-after').html(opt.placeholder);
								}, 0);
							}
						});
					} else {
						$select.append(sub.select.format({label: opt.placeholder, value: ''}));
					}
				}
				if (opt.dataUrl) {
					$.ajax({
						url: opt.dataUrl,
						success: function(data) {
							log('获取选项数据成功:', data);
							$.each(data.options, function(idx) {
								$select.append(sub.select.format(data.options[idx]));
							});
						},
						error: function(data) {
							console.error('[ERROR] 获取待选项失败', opt);
						}
					});
				} else if (opt.options !== undefined && opt.options.length > 0){
					$.each(opt.options, function(idx) {
						$select.append(sub.select.format(opt.options[idx]));
					});
				} else {
					$select.append(sub.select.format({label: '-- NO ITEM --', value: ''}));
				}
				break;

			// 多行文本
			case 'textarea':
				$node.find('textarea').attr('onfocus', 'this.placeholder=""');
				$node.find('textarea').attr('onblur', 'this.placeholder="' + opt.placeholder + '"');
				break;

			// 文本框
			case 'hidden':
			case 'text':
			case 'number':
			default:
				break;
		}

		// bind json
		$node.data('opts', opt);

		return $node;
	}

	// 添加联动事件
	function activeEventBinds($form, ebs) {
		// 触发器名字和事件详情的map
		var triggerName_eb_map = {};
		$.each(ebs, function(idx) {
			triggerName_eb_map[ebs[idx].trigger] = ebs[idx];
		});

		// 模板定义，TODO: 挪到真正的模板中	<<<---START--->>>
		var definedFunction = {};

		var definedEvents = {
			'valueChangeShowHide': 'change',
			'valueChangeDisable': 'change'
		};	// 用来绑定和解绑事件

		// 加入到事件模板？？
		// TODO: 加入魔板
		definedFunction['valueChangeShowHide'] = function(event) {
			// 当前事件的触发对象
			var $this = $(event.target);
			// 作用域（form）
			var $form = $this.closest('form');
			// 当前事件触发对象的name属性
			var triggerName = event.target.name;
			// 当前事件绑定的详情
			var eb = triggerName_eb_map[triggerName];
			// 所有响应对象名
			var allResp = [];
			$.each(eb.valueResps, function(value){
				allResp.add(eb.valueResps[value]);
			});

			var valueRespMap = eb.valueResps;		// {触发器的value: 响应对象的name}的关系
			var triggerValues = [];					// 触发器现在的值(为了可读性，实际未使用)
			var respNames = [];						// 取得当前值对应的所有响应对象

			if ($this.attr('type') == 'checkbox') {
				$.each($('[name=' + triggerName + ']:checked', $form), function(){
					triggerValues.push($this.val());
					respNames.add(valueRespMap[$this.val()]);
				});
			} else {
				triggerValues = [$this.val()];
				respNames.add(valueRespMap[$this.val()]);
			}
			log('Selected: [' + triggerValues.join(', ') + ']');

			// 初始化，隐藏所有响应对象
			$.each(allResp, function(idx){
				if (!!allResp[idx] && allResp[idx].length > 0) {
					$form.find('[name=' + allResp[idx] + ']').closest('.listNode').hide();
				}
			});

			// 遍历前值对应的所有响应对象，显示
			$.each(respNames, function(idx){
				if (!!respNames[idx] && respNames[idx].length > 0) {
					$form.find('[name=' + respNames[idx] + ']').closest('.listNode').show();
				}
			});
		}
		// 值改变选中对象的disable状态
		definedFunction['valueChangeDisable'] = function(event) {
			// 当前事件的触发对象
			var $this = $(event.target);
			// 作用域（form）
			var $form = $this.closest('form');
			// 当前事件触发对象的name属性
			var triggerName = event.target.name;
			// 当前事件绑定的详情
			var eb = triggerName_eb_map[triggerName];
			// 所有响应对象名
			var allResp = [];
			$.each(eb.valueResps, function(value){
				allResp.add(eb.valueResps[value]);
			});

			var valueRespMap = eb.valueResps;		// {触发器的value: 响应对象的name}的关系
			var triggerValues = [];					// 触发器现在的值(为了可读性，实际未使用)
			var respNames = [];						// 取得当前值对应的所有响应对象

			if ($this.attr('type') == 'checkbox') {
				$.each($('[name=' + triggerName + ']:checked', $form), function(){
					triggerValues.push($this.val());
					respNames.add(valueRespMap[$this.val()]);
				});
			} else {
				triggerValues = [$this.val()];
				respNames.add(valueRespMap[$this.val()]);
			}
			log('Selected: [' + triggerValues.join(', ') + ']');

			// 初始化，禁用所有响应对象
			$.each(allResp, function(idx){
				if (!!allResp[idx] && allResp[idx].length > 0) {
					$form.find('[name=' + allResp[idx] + ']').closest('.listNode').addClass('disabled');
					$form.find('[name=' + allResp[idx] + ']').closest('.listNode').find('input, select, textarea').prop('disabled', true);
				}
			});

			// 遍历前值对应的所有响应对象，取消禁用
			$.each(respNames, function(idx){
				if (!!respNames[idx] && respNames[idx].length > 0) {
					$form.find('[name=' + respNames[idx] + ']').closest('.listNode').removeClass('disabled');
					$form.find('[name=' + respNames[idx] + ']').closest('.listNode').find('input, select, textarea').prop('disabled', false);
				}
			});
		}
		// 模板定义，TODO: 挪到真正的模板中	<<<--- END --->>>

		// 遍历绑定联动事件 初始化绑定
		$.each(ebs || [], function(idx){
			var eb = ebs[idx];
			if ((eb.eventType in definedFunction) && (eb.eventType in definedEvents)) {
				var $trigger = $form.find('[name=' + eb.trigger + ']');
				var $triggerItem = $trigger.closest('.listNode');
				// 绑定联动事件
				$trigger.addClass('band').on(definedEvents[eb.eventType], definedFunction[eb.eventType]);
				// 初始化触发
				$trigger.trigger(definedEvents[eb.eventType]);
			} else {
				log('[WARN] Not support yet.', eb.eventType);
			}
		});
	}

	// 加规则
	function setFormRules($form, rules) {
		$.each(rules, function(name){
			var rule = rules[name];
			var $targets = $form.find('[name=' + name + ']');
			$.each(rule, function(ruleKey){
				var ruleValue = rule[ruleKey];
				var idx = ['true', 'false'].indexOf(ruleValue);
				if (idx != -1) {
					ruleValue = [true, false][idx];
				}
				if (ruleKey == 'required') {
					$targets.prop(ruleKey, ruleValue);
				} else {
					$targets.attr(ruleKey, ruleValue);
				}
			});
		});
	}



	// /////////////////////////////////////////////////////////////////////////////
	// 将已渲染和赋值的对象进行只读转换
	// /////////////////////////////////////////////////////////////////////////////
	function transRead($form) {
		var nodes = $form.find('li.listNode');
		$.each(nodes, function(idx){
			var $node = $(nodes[idx]);
			var contentList = [];
			var inputs = $node.find('input, select, textarea');
			$.each(inputs, function(_idx){
				var $this = $(inputs[_idx]);
				if ($this.is('input')){
					switch ($this.attr('type')) {
						case 'radio':
						case 'checkbox':
							if ($this.is(':checked')) {
								var label = $form.find('[for=' + $this.attr('id') + ']').html();
								contentList.push(label);
							}
							break;
						case 'text':
						default:
							var label = $this.val();
							contentList.push(label);
							break;
					}
				} else if ($this.is('select')) {
					// 单选
					if (!$this[0].hasAttribute("multiple")) {
						var value = $this.val();
						if (value) {
							var label = $this.find('[value="' + value + '"]').html();
							contentList.push(label);
						}
					}
					// 多选
					else {
						var values = $this.val() || '';
						var valueList;
						if (!$.isArray(values)) {
							valueList = values.split(',');
						} else {
							valueList = values;
						}
						$.each(valueList, function(i){
							var label = $this.find('[value="' + valueList[i] + '"]').html();
							if (!!valueList[i] && !!label){
								contentList.push(label);
							}
						});
					}
				} else if ($this.is('textarea')) {
					var label = $this.val();
					contentList.push(label);
				}
			});

			var contentJson = {
				label: $node.find('.item-title.label').html(),
				value: contentList.join(', ')
			}

			var readonlyHtml = 
				'<div class="item-content">' +
					'<div class="item-inner">' +
						'<div class="item-title label">{label}</div>' +
						'<div class="item-after item-after-fix">{value}</div>' +
					'</div>' +
				'</div>';

			$node.html(readonlyHtml.format(contentJson));
			if ($node.hasClass('disabled')) {
				$node.remove();
			}
		});
	}
	$.formb.transRead = transRead;


	// /////////////////////////////////////////////////////////////////////////////
	// 表单赋值
	// /////////////////////////////////////////////////////////////////////////////
	function setFormValue($form, values) {
		var formId = $form.attr('id');
		myApp.formFromData('#' + formId, values);
	}
	// 注册成为jQuery对象方法
	$.fn.setFormValue = function(values) {
		var $form = $(this);	// fw7时有可能有错，this的问题？
		setFormValue($form, values);
	}



	// /////////////////////////////////////////////////////////////////////////////
	// 工具类方法
	// /////////////////////////////////////////////////////////////////////////////

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

}));