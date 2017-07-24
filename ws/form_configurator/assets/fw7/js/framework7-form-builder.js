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

	// TODO: 校验
	$.fn.renderForm = function(jsonConf) {
		var $form = $(this);

		// 渲染生成form
		renderJson($form, jsonConf);

		// 加联动
		activeEventBinds($form, jsonConf.events);

		// 赋初值
		setFormValue($form, jsonConf.values);

		// 只读模式的实现
		if (jsonConf.isRead) {
			transRead($form);
		}

		log(jsonConf);
	}

	// 根据json渲染form的内容
	function renderJson($form, jsonConf) {
		var json_opts = jsonConf['items'];
		var json_rules = jsonConf['rules'];

		log('json_opts', json_opts);
		log('json_rules', json_rules);

//		$form.html('');

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
	function render(_opt, _$node, isRead) {
		var default_opt = {
			"name": "demo_text",
			"label": "测试文本",
			"outerWidth": 12,
			"labelWidth": 3,
			"contentWidth": 9,
			"widthInSteam": "auto"
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
				var $select = undefined;
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

			// 下拉多选
			case 'multiselect':
				var $select = undefined;
				console.log('isNew>>>', isNew);
				if (isNew) {
					$select = $(core[opt.type]);
				} else {
					$select = $('select', $node);
					$select.multiselect('destroy');
					$('.multiselect-native-select:eq(0)', $node).replaceWith($select);
				}
				$select.html('');
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

				$select.multiselect({
		            dropRight: true,
        			buttonContainer: '<div class="btn-group" style="width: 100%;" />',
        			nonSelectedText: opt.placeholder || '--请选择--',
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

				$select.on('change', function(){
					$(this).multiselect('refresh');
				});
				
				
				break;

			// 日期选择器
			case 'date':
				if (isNew) {
					$('.core', $node).replaceWith(core[opt.type]);		// 在非new情况下，这步不起作用
				}
				$('input', $node).attr('placeholder', opt.placeholder);

				$('input', $node).datetimepicker({
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

				$('.dataCleanBtn', $node).on('click', function() {
					$(this).parent().find('input').val('');
				});

				break;

			// 静态文字
			case 'static':
				if (isNew) {
					$('.core', $node).replaceWith(core[opt.type]);		// 在非new情况下，这步不起作用
				}
				$('.staticContent', $node).html(opt.placeholder);
				break;

			// 多行文本
			case 'textarea':
				if (isNew) {
					$('.core', $node).replaceWith(core[opt.type]);		// 在非new情况下，这步不起作用
				}
				$('textarea', $node).attr('placeholder', opt.placeholder);
				$('textarea', $node).attr('rows', opt.rows);
				$('textarea', $node).css('resize', opt.resize);
				$('textarea', $node).attr('onfocus', 'this.placeholder=""');
				$('textarea', $node).attr('onblur', 'this.placeholder="' + opt.placeholder + '"');
				break;

			// 文本框
			case 'hidden':
			case 'text':
			case 'number':
			default:
				if (isNew) {
					$('.core', $node).replaceWith(core[opt.type]);		// 在非new情况下，这步不起作用
				}
				$('input', $node).attr('placeholder', opt.placeholder);
				$('input', $node).attr('onfocus', 'this.placeholder=""');
				$('input', $node).attr('onblur', 'this.placeholder="' + opt.placeholder + '"');
				break;

		}

		// common
		$('.formLabel', $node).html(opt.label);

		if (opt.type == 'multiselect') {
			$('select', $node).attr('name', opt.name);
		} else {
			$('input, select, textarea', $node).attr('name', opt.name);
		}

		$('input, select, textarea', $node).attr('readonly', opt.readonly || false);
		$('.formDescription', $node).attr('title', opt.description);
		addOrReplaceClass($node, 'col-sm-' + opt.outerWidth);
		addOrReplaceClass($('.labelClass', $node), 'col-sm-' + opt.labelWidth);
		addOrReplaceClass($('.contentClass', $node), 'col-sm-' + opt.contentWidth);

		// bind json
		$node.data().opts = opt;

		// 解决static没有label错乱问题
		if ($node.data().opts.type == 'static') {
			var $label = $('.labelClass', $node);
			var $content = $('.staticContent', $node);
			if ($label.length == 0 || $label.children().length == 0 || $($label.children()[0]).html().trim().length == 0) {
				$content.css({
					'padding-top': '0px',
					'vertical-align': 'middle'
				});
			}
		}

		return $node;
	}
	// 注册成为formb的方法
	$.formb.render = render;
	// 注册成为formb的方法
	$.formb.activeEventBinds = activeEventBinds;

	// 添加联动事件
	function activeEventBinds($form, ebs, configueMode) {
		var isConfig = configueMode || false;

		// 模板定义，TODO: 挪到真正的模板中	<<<---START--->>>
		var definedFunction = {};

		var definedEvents = {
			'valueChangeShowHide': 'change.valueChangeShowHide',
			'valueChangeDisable': 'change.valueChangeDisable'
		};	// 用来绑定和解绑事件

		// 加入到事件模板？？
		// TODO: 加入魔板
		definedFunction['valueChangeShowHide'] = function(event) {
			var allResp = event.data.allResp;
			var $form = event.data.$form;
			var eb = event.data.eb;
			var configueMode = event.data.configueMode;

			var valueRespMap = eb.valueResps;		// {触发器的value: 响应对象的name}的关系
			var triggerValues = [];					// 触发器现在的值(为了可读性，实际未使用)
			var respNames = [];						// 取得当前值对应的所有响应对象

			if ($(this).attr('type') == 'checkbox') {
				$.each($('[name=' + $(this).attr('name') + ']:checked', $form), function(){
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
		// 值改变选中对象的disable状态
		definedFunction['valueChangeDisable'] = function(event) {
			var allResp = event.data.allResp;
			var $form = event.data.$form;
			var eb = event.data.eb;
			var configueMode = event.data.configueMode;

			var valueRespMap = eb.valueResps;		// {触发器的value: 响应对象的name}的关系
			var triggerValues = [];					// 触发器现在的值(为了可读性，实际未使用)
			var respNames = [];						// 取得当前值对应的所有响应对象

			if ($(this).attr('type') == 'checkbox') {
				$.each($('[name=' + $(this).attr('name') + ']:checked', $form), function(){
					triggerValues.push($(this).val());
					respNames.add(valueRespMap[$(this).val()]);
				});
			} else {
				triggerValues = [$(this).val()];
				respNames.add(valueRespMap[$(this).val()]);
			}
			log('Selected: [' + triggerValues.join(', ') + ']');

			// 初始化，禁用所有响应对象
			$.each(allResp, function(){
				if (!!this && this.length > 0) {
					/*if (configueMode) {
						$('[name=' + this + ']', $form).closest('.drag_item').addClass('fakeHide');
					} else {
						$('[name=' + this + ']', $form).closest('.drag_item').hide();
					}*/
					$('[name=' + this + ']', $form).closest('.drag_item').find(':input').attr('disabled', true);
				}
			});

			// 遍历前值对应的所有响应对象，取消禁用
			$.each(respNames, function(){
				if (!!this && this.length > 0) {
					/*if (configueMode) {
						$('[name=' + this + ']', $form).closest('.drag_item').removeClass('fakeHide');
					} else {
						$('[name=' + this + ']', $form).closest('.drag_item').show();
					}*/
					$('[name=' + this + ']', $form).closest('.drag_item').find(':input').attr('disabled', false);
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

				case 'valueChangeDisable':
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

					// 禁用所有被联动对象
					$.each(allResp, function() {
						if (!!this && this.length > 0) {
							/*if (!isConfig) {
								$('[name=' + this + ']', $form).closest('.drag_item').hide();
							} else {
								$('[name=' + this + ']', $form).closest('.drag_item').addClass('fakeHide');
							}*/
							$('[name=' + this + ']', $form).closest('.drag_item').find(':input').attr('disabled', true);
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
	// 将已渲染和赋值的对象进行只读转换
	// /////////////////////////////////////////////////////////////////////////////
	function transRead($form) {
		$.each($form.children(), function(){
			var $node = $(this);
			var contentList = [];
			$.each($node.find('.coreInput'), function(){
				var $this = $(this);
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
							var label = $this.find('[value=' + value + ']').html();
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
							var label = $this.find('[value=' + valueList[i] + ']').html();
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

			// 静态文字的特殊处理
			if ($node.data().opts !== undefined && $node.data().opts.type == 'static') {
				var label = $node.find('.staticContent').html();
				contentList.push(label);
			}

			var contentStr = contentList.join(', ');
			if (!($node.find('.contentClass').hasClass('form-control-static'))) {
				$node.find('.contentClass').html(contentStr)
						.addClass('form-control-static').attr('title', contentStr);
			}
		});
		$form.find('.textRequired').removeClass('textRequired');
	}
	$.formb.transRead = transRead;


	// /////////////////////////////////////////////////////////////////////////////
	// 表单赋值与取值
	// /////////////////////////////////////////////////////////////////////////////
	function setFormValue($form, values) {
		$.each(values || [], function(name) {
			var value = values[name];

			var targets = $('[name=' + name + ']', $form);

			$.each(targets, function() {
				var $this = $(this);
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
	$.fn.setFormValue = function(values) {
		var $form = $(this);
		setFormValue($form, values);
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
					o[this.name] = this.value || '';
				}
			}
		});
		return o;
	}

	// 添加或替换col-sm的class
	function addOrReplaceClass($obj, new_class) {
		var notFound = true;
		if ($obj.length != 0) {
			var list_class = $obj.attr('class').split(' ');
			$.each(list_class, function(idx) {
				if (this.indexOf('col-sm-') >= 0) {
					notFound = false;
					list_class[idx] = new_class;
				}
			});
			if (notFound) {
				list_class.push(new_class);
			}
			$obj.attr('class', list_class.join(' '));
		}
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