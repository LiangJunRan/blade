;(function (factory) {
	'use strict';
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define('formb', ['jquery', 'formc-templates'], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
}(function ($) {
	// 检查依赖引用
	function checkEnv() {
		if ($.validator === undefined) {
			console.error('[ERROR] Must import jquery.validator first.');
			return false;
		}
		if ($.formc === undefined || $.formc.templates === undefined) {
			console.error('[ERROR] Must import formc.templates first.');
			return false;
		}
		return true;
	}
	if (!checkEnv()) {
		return false;
	}

	// /////////////////////////////////////////////////////////////////////////////
	// 全局变量 - Global Parameters
	// /////////////////////////////////////////////////////////////////////////////
	$.formb = $.formb || {};
	var shellTemplate = $.formc.templates.shellTemplate;
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
			log = console.log;
		}
	}

	/** 
	 * 当所有异步步骤都走完以后，再执行绑定校验方法
	 * @param: deferredObjectList	延迟类的list
	 * @param: callback				监听的全部延迟类结束后执行的回调方法
	 * @param: callbackArgsList		list形式的回调方法参数
	 */
	function afterAllAjaxCompleteDo(deferredObjectList, callback, callbackArgsList){
		$.when.apply(this, deferredObjectList).then(function(){
			log('ALL DONE');
			callback.apply(this, callbackArgsList);
		});
	}

	$.fn.renderForm = function(jsonConf) {
		var $form = $(this);

		initValidator($form);

		renderJson($form, jsonConf);

		afterAllAjaxCompleteDo(deferredObjectList, setFormRules, [$form]);

		activeEventBinds($form, jsonConf.events);

		/*$form.append(
			// '<hr class="col-sm-12" />' +
			'<div class="col-sm-9 col-sm-offset-3">' +
				'<button type="submit" class="btn btn-primary">Submit</button>' +
			'</div>');
		$form.find('button[type=submit]').on('click', function(){
			$form.submit();
		});*/

		// removeAllUselessStuff();
		log(jsonConf);
	}

	// 根据json渲染form的内容
	function renderJson($form, jsonConf) {
		var json_opts = jsonConf['items'];
		var json_rules = jsonConf['rules'];

		log('json_opts', json_opts);
		log('json_rules', json_rules);

		$form.html('');

		$.each(json_opts || [], function(_idx){
			var $item = render(this);

			$item.removeClass('base');
			// 加入新对象
			$form.append($item);

			$item.data().opts = this;
			$item.data().rule = json_rules[this.name];
		});
	}

	// 每个节点渲染的方法
	function render(_opt, _$node) {
		var default_opt = {
			"name": "demo_text",
			"label": "测试文本",
			"outerWidth": 12,
			"labelWidth": 3,
			"contentWidth": 9
		};
		var opt = $.extend(true, {}, default_opt, _opt);
		var isNew = !(_$node);
		$node = _$node || $(shellTemplate);		// 指定了，就是用指定点

		// case by type
		switch (opt.type) {
			// 单选、多选
			case 'radio':
			case 'checkbox':
				var $content;
				if (isNew) {
					$content = $(core[opt.type]);
				} else {
					$content = $('.formContent', _$node);
					$content.html('');
				}
				if (opt.dataUrl) {
					var deferredObj = $.ajax({
						url: opt.dataUrl,
						success: function(data) {
							log('获取选项数据成功:', data);
							$.each(data.options, function() {
								var $sub = $(sub[opt.type]);
								var random_id = randomId();
								$('.itemLabel', $sub).html(this.label).attr('for', random_id);
								$('input', $sub).attr('value', this.value).attr('id', random_id);

								$content.append($sub);
							});
							$('input, select, textarea', $content).attr('name', opt.name);
						},
						error: function(data) {
							console.error('[ERROR] 获取待选项失败', opt);
						},
						complete: function(data) {
							log('DONE', data);
						}
					});
					deferredObjectList.push(deferredObj);
				} else if (opt.options !== undefined && opt.options.length > 0){
					$.each(opt.options, function() {
						var $sub = $(sub[opt.type]);
						var random_id = randomId();
						$('.itemLabel', $sub).html(this.label).attr('for', random_id);
						$('input', $sub).attr('value', this.value).attr('id', random_id);

						$content.append($sub);
					});
				} else {
					$content.append('<div class="form-control-static">-- 未配置选项 --</div>');
				}
				if (isNew) {
					$('.core', $node).replaceWith($content);
				}
				break;

			// 下拉框
			case 'select':
				var $select;
				if (isNew) {
					$select = $(core[opt.type]);
				} else {
					$select = $('select', _$node);
					$select.html('');
				}
				if (opt.placeholder) {
					$select.append('<option value="">' + opt.placeholder + '</option>')
				}
				if (opt.dataUrl) {
					$.ajax({
						url: opt.dataUrl,
						success: function(data) {
							log('获取选项数据成功:', data);
							$.each(data.options, function() {
								$select.append('<option value="' + this.value + '">' + this.label + '</option>');
							});
						},
						error: function(data) {
							console.error('[ERROR] 获取待选项失败', opt);
						}
					});
				} else if (opt.options !== undefined && opt.options.length > 0){
					$.each(opt.options, function() {
						$select.append('<option value="' + this.value + '">' + this.label + '</option>');
					});
				} else {
					$select.append('<option value="">--No-Item--</option>');
				}
				if (isNew) {
					$('.core', $node).replaceWith($select);
				}
				break;

			// 文本框
			case 'hidden':
			case 'text':
			case 'number':
			case 'datepicker':
			default:
				if (isNew) {
					$('.core', $node).replaceWith(core[opt.type]);		// 在非new情况下，这步不起作用
				}
				$('input', $node).attr('placeholder', opt.placeholder);
				break;

		}

		// common
		$('.formLabel', $node).html(opt.label);
		$('input, select, textarea', $node).attr('name', opt.name);
		$('.formDescription', $node).attr('title', opt.description);
		addOrReplaceClass($node, 'col-sm-' + opt.outerWidth);
		addOrReplaceClass($('.labelClass', $node), 'col-sm-' + opt.labelWidth);
		addOrReplaceClass($('.contentClass', $node), 'col-sm-' + opt.contentWidth);

		// bind json
		$node.data().opts = opt;

		return $node;
	}
	// 注册成为formb的方法
	$.formb.render = render;

	// 初始化form校验器
	function initValidator($form) {
		log('[校验] 初始化-前，dropFormValidator =', dropFormValidator);
		$.validator.setDefaults({
			// debug: true,
			ignore: '.ignore',
			errorClass: 'text-danger',
			errorPlacement: function (label, element) {
				$(label).html($(label).html().replace(/:|：/g, ''));
				$(element).closest('.contentClass').find('.help-block-error').append(label);
			},
			success: function (label, element) {
				label.remove();
			}
		});
		dropFormValidator = $form.validate();
		log('[校验] 初始化-后，dropFormValidator =', dropFormValidator);
	}

	// 配置form校验规则
	function setFormRules($form) {
		log('[校验] 设置（重设）表单校验规则-前');
		var formRules = {};
		$.each($form.children(), function(){
			var $this = $(this);
			if (!$this.hasClass('append_holder')) {
				if ($this.data().rule === undefined) {
					log($this.data().opts);
					if ($this.data().opts !== undefined) {
						$this.data().rule = rule[$this.data().opts.type];
					} else {
						console.warn('[WARN] Not found data().opts.', $this[0].outerHTML);
					}
				}
				if ($this.data().rule !== undefined) {
					formRules[$this.data().opts.name] = $this.data().rule;
					if ($this.data().rule.required) {
		                $('.textRequired', $this).addClass('symbol required');
		            } else {
		            	$('.textRequired', $this).removeClass('symbol required');
		            }
		        	// 删掉所有规则，再重新添加的方法，目前未发现能替换的方法
		            if (dropFormValidator) {
		            	if ($this.find(':input').length > 0) {
			                $this.find(':input').rules('remove');
			                
			                // 去掉所有undefined和null的规则，不去掉会造成validator报错
			                var rule = {};
			                $.each($this.data().rule || [], function(key){
			                	if (this !== undefined && this !== null) {
			                		rule[key] = this;
			                	}
			                })
			                
			                $this.find(':input').rules('add', rule);
		            	} else {
		            		log('[WARN] Validate item not found :input.', $this[0].outerHTML);
		            	}
		            } else {
		            	// 貌似永远都不会进来？？
		            	log('XXXdropFormValidator is', dropFormValidator);
		            };
				} else {
					console.warn('[WARN] Not found data().rule.', $this[0].outerHTML);
				}
			}
		});

		// 清空表单
		/*if (dropFormValidator) {
			dropFormValidator.resetForm();
		}*/

		log('[校验] 设置（重设）表单校验规则-后');
	}


	// 注册成为formb的方法
	$.formb.activeEventBinds = activeEventBinds;

	// 添加联动事件
	function activeEventBinds($form, ebs, configueMode) {
		var isConfig = configueMode || false;

		// 模板定义，TODO: 挪到真正的模板中	<<<---START--->>>
		var definedFunction = {};

		var definedEvents = {
			'valueChangeShowHide': 'change.valueChangeShowHide'
		};	// 用来绑定和解绑事件

		// 加入到事件模板？？
		// TODO: 加入魔板
		// TODO: 解决checkbox多选问题>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		definedFunction['valueChangeShowHide'] = function(event) {
			var allResp = event.data.allResp;
			var $form = event.data.$form;
			var eb = event.data.eb;
			var configueMode = event.data.configueMode;

			var valueRespMap = eb.valueResps;		// {触发器的value: 响应对象的name}的关系
			var triggerValues = [];					// 触发器现在的值(为了可读性，实际未使用)
			var respNames = [];						// 取得当前值对应的所有响应对象

			if ($(this).attr('type') == 'checkbox') {
				$.each($('[name=' + $(this).attr('name') + ']:checked'), function(){
					triggerValues.push($(this).val());
					respNames.add(valueRespMap[$(this).val()]);
				});
			} else {
				triggerValues = [$(this).val()];
				respNames.add(valueRespMap[$(this).val()]);
			}
			log('Selected: [' + triggerValues.join(', ') + ']');

			// 初始化，隐藏所有响应对象
			$.each(allResp, function(){
				if (!!this && this.length > 0) {
					if (configueMode) {
						$('[name=' + this + ']', $form).closest('.drag_item').addClass('fakeHide');
					} else {
						$('[name=' + this + ']', $form).closest('.drag_item').hide();
					}
				}
			});

			// 遍历前值对应的所有响应对象，显示
			$.each(respNames, function(){
				if (!!this && this.length > 0) {
					if (configueMode) {
						$('[name=' + this + ']', $form).closest('.drag_item').removeClass('fakeHide');
					} else {
						$('[name=' + this + ']', $form).closest('.drag_item').show();
					}
				}
			});
		}
		// 模板定义，TODO: 挪到真正的模板中	<<<--- END --->>>

		// 先去掉所有的已绑定事件和样式 ============================
		// 遍历所有已定义的事件变量，解绑所有自定义绑定的事件
		$.each(definedEvents, function(key) {
			var event = definedEvents[key];
			// form中使用.band标记已绑定事件的对象
			$form.find('.band').off(event);
		})
		// 去掉所有触发器的样式
		$form.find('.bandTrigger').removeClass('bandTrigger');
		// 去掉所有配置模式的样式
		$form.find('.fakeHide').removeClass('fakeHide');

		// 然后重新绑定事件和样式 ==================================
		// 遍历绑定联动事件
		$.each(ebs || [], function(){
			var eb = this;

			switch(eb.eventType) {
				case 'valueChangeShowHide':
					var $trigger = $('[name=' + eb.trigger + ']', $form);
					var $triggerItem = $trigger.closest('.drag_item');
					if (isConfig) {
						$triggerItem.addClass('bandTrigger');
					}

					// 获取所有被联动对象(resp)的name
					// TODO: 去重allResp
					var allResp = [];
					$.each(eb.valueResps, function(value){
						allResp.add(eb.valueResps[value]);
					});

					// 隐藏所有被联动对象
					$.each(allResp, function() {
						if (!!this && this.length > 0) {
							if (!isConfig) {
								$('[name=' + this + ']', $form).closest('.drag_item').hide();
							} else {
								$('[name=' + this + ']', $form).closest('.drag_item').addClass('fakeHide');
							}
						}
					});

					// 绑定事件
					$trigger.addClass('band').on(
						definedEvents[eb.eventType],
						'',
						{
							allResp: allResp, 
							$form: $form, 
							eb: eb,
							configueMode: isConfig
						},
						definedFunction[eb.eventType]);
					break;
				default:
					log('[WARN] Not support yet.', eb.eventType);
					break;
			}
		});
	}



	// /////////////////////////////////////////////////////////////////////////////
	// 表单赋值与取值
	// /////////////////////////////////////////////////////////////////////////////
	function setFormValue(values) {
		var $form = $(this);
		console.log(values);
		$.each(values || [], function(name) {
			var value = values[name];

			var targets = $('[name=' + name + ']', $form);

			console.log(targets.length, name, value);

			$.each(targets, function() {
				var $this = $(this);
				console.log($this.attr('type'), (['radio', 'checkbox'].indexOf($this.attr('type')) != -1));
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
	}
	// 注册成为jQuery对象方法
	$.fn.setFormValue = setFormValue;



	// /////////////////////////////////////////////////////////////////////////////
	// 工具类方法
	// /////////////////////////////////////////////////////////////////////////////

	// 随机id(固定前缀)
	function randomId(prefix){
		return ( prefix || '' ) + ( new Date().valueOf().toString(36)+Math.random().toString(36) ).split('0.').join('_').toUpperCase();
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
				o[this.name].push(this.value || null);
			} else {
				if (this.value === "false") {
					o[this.name] = false;
				} else if (this.value === "true") {
					o[this.name] = true;
				} else {
					o[this.name] = this.value || null;
				}
			}
		});
		return o;
	}

	// 添加或替换col-sm的class
	function addOrReplaceClass($obj, new_class) {
		var notFound = true;
		var list_class = $obj.attr('class').split(' ');
		$.each(list_class, function(idx) {
			if (this.indexOf('col-sm-') >=0) {
				notFound = false;
				list_class[idx] = new_class;
			}
		});
		if (notFound) {
			list_class.push(new_class);
		}
		$obj.attr('class', list_class.join(' '));
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

}));