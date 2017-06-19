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
	var debug_mode = true;

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

		$form.append(
			// '<hr class="col-sm-12" />' +
			'<div class="col-sm-9 col-sm-offset-3">' +
				'<button type="submit" class="btn btn-primary">Submit</button>' +
			'</div>');
		$form.find('button[type=submit]').on('click', function(){
			$form.submit();
		});

		// removeAllUselessStuff();
	}

	// 根据json渲染form的内容
	function renderJson($form, jsonConf) {
		var json_opts = jsonConf['items'];
		var json_rules = jsonConf['rules'];

		log('json_opts', json_opts);
		log('json_rules', json_rules);

		$form.html('');

		$.each(json_opts, function(_idx){
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
				$('core', $node).replaceWith($content);		// 在非new情况下，这步不起作用
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
				$('core', $node).replaceWith($select);		// 在非new情况下，这步不起作用
				break;

			// 文本框
			case 'hidden':
			case 'text':
			case 'number':
			case 'datepicker':
			default:
				$('core', $node).replaceWith(core[opt.type]);		// 在非new情况下，这步不起作用
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
			                $this.find(':input').rules('add', $this.data().rule);
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
		// var $form = $('#dropForm');
		$form.find('.bandEvent').removeClass('bandEvent');
		// TODO: unbind

		$.each(ebs, function(){
			var eb = this;

			switch(eb.eventType) {
				case 'valueChangeShowHide':
					var $trigger = $('[name=' + eb.trigger + ']', $form);
					var $triggerItem = $trigger.closest('.drag_item');
					$triggerItem.addClass('bandEvent');

					var allResp = [];
					$.each(eb.valueResps, function(value){
						if ($.isArray(eb.valueResps[value])) {
							$.each(eb.valueResps[value], function(key){
								allResp.push(eb.valueResps[value][key]);
							});
						} else {
							allResp.push(eb.valueResps[value]);
						}
					});

					// 实际使用
					if (!isConfig) {
						// 隐藏已设定项
						$.each(allResp, function() {
							if (!!this && this.length > 0) {
								$('[name=' + this + ']', $form).closest('.drag_item').hide();
							}
						});
						$('.bandEvent', $form).removeClass('bandEvent');

						// TODO: 去重allResp
						$trigger.addClass('band').on('change', function(){
							$.each(allResp, function(){
								if (!!this && this.length > 0) {
									$('[name=' + this + ']', $form).closest('.drag_item').hide();
								}
							});
							if ($.isArray(eb.valueResps[$(this).val()])) {
								$.each(eb.valueResps[$(this).val()], function(){
									if (!!this && this.length > 0) {
										$('[name=' + this + ']', $form).closest('.drag_item').show();
									}
								});
							} else {
								if (!!eb.valueResps[$(this).val()] && eb.valueResps[$(this).val()].length > 0) {
									$('[name=' + eb.valueResps[$(this).val()] + ']', $form).closest('.drag_item').show();
								}
							}
						});
					}
					// 
					else {
						// 隐藏已设定项
						$.each(allResp, function() {
							if (!!this && this.length > 0) {
								$('[name=' + this + ']', $form).closest('.drag_item').addClass('fakeHide');
							}
						});

						// TODO: 去重allResp
						$trigger.addClass('band').on('change', function(){
							$.each(allResp, function(){
								if (!!this && this.length > 0) {
									$('[name=' + this + ']', $form).closest('.drag_item').addClass('fakeHide');
								}
							});
							if ($.isArray(eb.valueResps[$(this).val()])) {
								$.each(eb.valueResps[$(this).val()], function(){
									if (!!this && this.length > 0) {
										$('[name=' + this + ']', $form).closest('.drag_item').removeClass('fakeHide');
									}
								});
							} else {
								if (!!eb.valueResps[$(this).val()] && eb.valueResps[$(this).val()].length > 0) {
									$('[name=' + eb.valueResps[$(this).val()] + ']', $form).closest('.drag_item').removeClass('fakeHide');
								}
							}
						});
					}

					

					break;
				default:
					log('[WARN] Not support yet.', eb.eventType);
					break;
			}
		});
	}



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

}));