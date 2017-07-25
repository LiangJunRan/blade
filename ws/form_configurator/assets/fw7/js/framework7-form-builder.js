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
	var debug_mode = true;

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
		log('renderJson0');
		renderJson($form, jsonConf);
		log('renderJson1');

		// 加联动
		// activeEventBinds($form, jsonConf.events);

		// 赋初值
		log('renderJson0');
		setFormValue($form, jsonConf.values);
		log('renderJson1');

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
			log('render-' + _idx + '-0');
			var $item = render(json_opts[_idx]);
			log('render-' + _idx + '-1');


			// 加入新对象
			log('addToForm-' + _idx + '-0');
			addToForm($item, $form);
			log('addToForm-' + _idx + '-1');


			// $item.data().opts = this;
			// $item.data().rule = json_rules[this.name];
		});
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
			var $li = $('<li></li>');
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
			// 单选、多选
			/*case 'radio':
			case 'checkbox':
				break;*/

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

			// 日期选择器
			/*case 'date':
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

				break;*/

			// 静态文字
			/*case 'static':
				if (isNew) {
					$('.core', $node).replaceWith(core[opt.type]);		// 在非new情况下，这步不起作用
				}
				$('.staticContent', $node).html(opt.placeholder);
				break;*/

			// 多行文本
			case 'textarea':
				/*if (isNew) {
					$('.core', $node).replaceWith(core[opt.type]);		// 在非new情况下，这步不起作用
				}
				$('textarea', $node).attr('placeholder', opt.placeholder);
				$('textarea', $node).attr('rows', opt.rows);
				$('textarea', $node).css('resize', opt.resize);*/
				$node.find('textarea').attr('onfocus', 'this.placeholder=""');
				$node.find('textarea').attr('onblur', 'this.placeholder="' + opt.placeholder + '"');
				break;

			// 文本框
			case 'hidden':
			case 'text':
			case 'number':
			default:
				// if (isNew) {
				// 	$('.core', $node).replaceWith(core[opt.type]);		// 在非new情况下，这步不起作用
				// }
				// $('input', $node).attr('placeholder', opt.placeholder);
				// $('input', $node).attr('onfocus', 'this.placeholder=""');
				// $('input', $node).attr('onblur', 'this.placeholder="' + opt.placeholder + '"');
				break;

		}

		// common
		/*$('.formLabel', $node).html(opt.label);

		if (opt.type == 'multiselect') {
			$('select', $node).attr('name', opt.name);
		} else {
			$('input, select, textarea', $node).attr('name', opt.name);
		}
*/
		// $node.find('input, select, textarea').attr('readonly', opt.readonly || false);
		// $node.find('.formDescription').attr('title', opt.description);
		/*addOrReplaceClass($node, 'col-sm-' + opt.outerWidth);
		addOrReplaceClass($('.labelClass', $node), 'col-sm-' + opt.labelWidth);
		addOrReplaceClass($('.contentClass', $node), 'col-sm-' + opt.contentWidth);*/

		// bind json
		$node.data('opts', opt);

		// 解决static没有label错乱问题
		/*if ($node.data().opts.type == 'static') {
			var $label = $('.labelClass', $node);
			var $content = $('.staticContent', $node);
			if ($label.length == 0 || $label.children().length == 0 || $($label.children()[0]).html().trim().length == 0) {
				$content.css({
					'padding-top': '0px',
					'vertical-align': 'middle'
				});
			}
		}*/

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