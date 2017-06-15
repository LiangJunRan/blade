;(function (factory) {
	'use strict';
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define('formc', ['jquery', 'formc-templates'], factory);
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
		if (style_html === undefined || js_beautify === undefined) {
			console.error('[ERROR] Must import html_formater first.');
			return false;
		}
		if ($.formc === undefined || $.formc.templates === undefined) {
			console.error('[ERROR] Must import formc.templates first.');
			return false;
		}
		if ($.fn.renderForm === undefined || $.formb === undefined) {
			console.error('[ERROR] Must import form-builder first.');
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
	var shellTemplate = $.formc.templates.shellTemplate;
	var core = $.formc.templates.core;
	var sub = $.formc.templates.sub;
	var opts = $.formc.templates.opts;
	var rule = $.formc.templates.rule;

	// 调试模式开关
	var debug_mode = true;

	// form校验器
	var dropFormValidator = undefined;

	// 每个已插入元素的坐标和宽高	// TODO: 改成传递变量
	var location_list = [];

	// requestAnimationFrame句柄
	var anime;

	// 调试打印日志方法
	function log() {
		if (debug_mode) {
			console.log(arguments);
		}
	}



	// /////////////////////////////////////////////////////////////////////////////
	// 入口 - Main
	// /////////////////////////////////////////////////////////////////////////////
	$(document).ready(function(){
		initValidator();
		componentsContainer_init();
		drag_init();

		$('#clearAll').on('click', clearAll);
		$('#getJson').on('click', getJson);
		$('#checkForm').on('click', checkForm);
		$('#renderJson').on('click', renderJson);

		$('.taggleMode').on('click', taggleMode);
	});



	// /////////////////////////////////////////////////////////////////////////////
	// 组件 - Components
	// /////////////////////////////////////////////////////////////////////////////

	// 组件柜 - 初始化
	function componentsContainer_init() {
		$.each(opts, function(key){
			var $c = render(opts[key]);
			$('.components_container').append($c);
		});

		// 用双击事件来做拖拽的事儿
		$('.base').on('dblclick', function() {
			var new_node = $(this.outerHTML);
			new_node.removeClass('base');
			// 复制模式需要重新绑定事件
			new_node.on('dragstart', dragStart);
			new_node.on('dragend', dragEnd);
			new_node.on('dblclick', config);

			while (hasSameId(new_node.attr('id'))) {
				var id = new_node.attr('id');
				var order = parseInt(id.split('-')[id.split('-').length - 1]) + 1;
				new_node.attr('id', 'drag-item-' + order);
			}

			$('.drop_container').append(new_node);

			new_node.data().opts = $(this).data().opts;

			// 为了防止name相同bug，暂时采用重置name的方法，以后需要解决
			// TODO
			var new_name = new_node.data().opts.name + '_' + randomId();
			new_node.data().opts.name = new_name;

			// new_node.data().rule = {'required': true};		// TODO	删掉
			// 重新渲染，以生成需要用到的随机id
			render(new_node.data().opts, new_node);

			setFormRules();
		});
	}

	// 组件 - 渲染 (从formb引用)
	var render = $.formb.render;



	// /////////////////////////////////////////////////////////////////////////////
	// 详细配置 - Detail
	// /////////////////////////////////////////////////////////////////////////////
	
	// 生成布尔类型选项
	function booleanItem(label, key, defaultValue) {
		// TODO: 改成switch组件
		var $item = $(
			'<div class="row padbtm">' +
				'<label class="col-sm-4 form-control-static">' + label + '</label>' +
				'<div class="col-sm-8">' +
					'<div class="radio clip-radio radio-primary radio-inline">' +
						'<input type="radio" name="' + key + '" id="' + key + '_radio_1" value="true">' +
						'<label class="itemLabel" for="' + key + '_radio_1">是</label>' +
					'</div>' +
					'<div class="radio clip-radio radio-primary radio-inline">' +
						'<input type="radio" name="' + key + '" id="' + key + '_radio_2" value="false">' +
						'<label class="itemLabel" for="' + key + '_radio_2">否</label>' +
					'</div>' +
				'</div>' +
			'</div>');
		$item.find('input[value="' + defaultValue + '"]').click();
		return $item;
	}
	// 生成数字类型输入项
	function numberItem(label, key, defaultValue) {
		// TODO: 改成slider组件
		var $item = $(
			'<div class="row padbtm">' +
				'<label class="col-sm-4 form-control-static">' + label + '</label>' +
				'<div class="col-sm-8">' +
					'<input type="number" class="form-control" name="' + key + '" value="' + defaultValue + '" />' +
				'</div>' +
			'</div>');
		return $item;
	}

	// 弹出配置详情页面
	function pop_detail($item) {
		var $detail_window = $(
			'<div class="item_detail_container item_detail_container_in">' +
				'<div class="item_detail_header"><h4><i class="fa fa-cog"></i> 详细配置</h4></div>' +
				'<div class="item_detail_body">' +
					'<h4>详细设置</h4>' +
					'<form class="item_detail_form"></form>' +
					'<h4>校验规则</h4>' +
					'<form class="item_rule_form"></form>' +
				'</div>'+
				'<div class="item_detail_footer">' +
					'<button class="btn btn-success commit_btn">' +
						'<i class="fa fa-check"></i>' +
					'</button>' +
					'<button class="btn btn-primary cancel_btn">' +
						'<i class="fa fa-close"></i>' +
					'</button>' +
				'</div>' +
			'</div>');

		$detail_window.find('.commit_btn').on('click', function() {
			close_detail(true);
			close_config();
		});

		$detail_window.find('.cancel_btn').on('click', function() {
			close_detail();
			close_config();
		});

		// 详细设置
		var $detail_form = $('.item_detail_form', $detail_window);

		$('body').append($detail_window);

		$detail_window.data().item = $item;		// 绑定对象到弹出窗口，方便关闭时局部render

		$.each($item.data().opts, function(key) {
			if (key != 'options') {
				var $info = $(
					'<div class="row padbtm">' +
						'<label class="col-sm-4 form-control-static">' + key + '</label>' +
						'<div class="col-sm-8">' +
							'<input type="text" name="' + key + '" class="form-control" value="' + $item.data().opts[key] + '"/>' +
						'</div>' +
					'</div>');
				if (key == 'type') {
					$('input', $info).attr('readonly', 'readonly');
				}
				$detail_form.append($info);
			}
		});
		// 针对选项做特殊处理
		if (['select', 'radio', 'checkbox'].indexOf($item.data().opts.type) != -1) {
			var options_html = '';
			$.each($item.data().opts.options, function() {
				if (!!this.label && !!this.value) {
					options_html += 
						'<div class="row padbtm">' +
							'<div class="col-sm-5">' + 
								'<input type="text" class="form-control" name="options.label" value="' + this.label + '"/>' + 
							'</div>' +
							'<div class="col-sm-4">' + 
								'<input type="text" class="form-control" name="options.value" value="' + this.value + '"/>' +
							'</div>' +
							'<div class="col-sm-3">' +
								'<button type="button" class="btn btn-danger btn-block delOption"><i class="fa fa-close"></i></button>' +
							'</div>' +
						'</div>';
				}
			});
				
			var $info = $(
				'<div class="row padbtm" style="border: dashed 1px #aaa;">' +
					'<label class="col-sm-4 form-control-static">options</label>' +
					'<div class="col-sm-8">' +
						options_html +
						'<button type="button" class="btn btn-success btn-sm addOption"><i class="fa fa-plus"></i></button>' +
					'</div>' +
				'</div>');
			$('.delOption', $info).on('click', function(){
				$(this).closest('.row').remove();
			});

			$('.addOption', $info).on('click', function(){
				var $option = $(
					'<div class="row padbtm">' +
						'<div class="col-sm-5">' + 
							'<input type="text" class="form-control" name="options.label" />' + 
						'</div>' +
						'<div class="col-sm-4">' + 
							'<input type="text" class="form-control" name="options.value" />' +
						'</div>' +
						'<div class="col-sm-3">' +
							'<button type="button" class="btn btn-danger btn-block delOption"><i class="fa fa-close"></i></button>' +
						'</div>' +
					'</div>');
				$(this).before($option);
				$('.delOption', $option).on('click', function(){
					$(this).closest('.row').remove();
				});
			});

			// 针对dataUrl的特殊处理
			var $dataUrl = $detail_form.find('[name=dataUrl]');
			if ($dataUrl.val() == 'null') {
				$dataUrl.val('');
			}
			$dataUrl.attr('placeholder', '留空使用options ↓↓↓');
			// 绑定联动
			$dataUrl.on('input', function() {
				if ($(this).val().length == 0) {
					$info.show();
				} else {
					$info.hide();
				}
			});
			// 初始状态
			if ($dataUrl.val().length == 0) {
				$info.show();
			} else {
				$info.hide();
			}

			$detail_form.append($info);
		}
		log('增加detail');

		// 校验规则
		var $rule_form = $('.item_rule_form', $detail_window);
		var rule = $item.data().rule;

		switch($item.data().opts.type) {
			case 'text':
				$rule_form.append(booleanItem('必填', 'required', rule['required']));
				$rule_form.append(numberItem('最大长度', 'maxlength', rule['maxlength']));
				$rule_form.append(numberItem('最小长度', 'minlength', rule['minlength']));
				break;
			default:
				$rule_form.append(booleanItem('必填', 'required', rule['required']));
				break;
		}
		log('增加校验配置');
	}

	// 关闭配置详情页面
	function close_detail(save) {
		if (save) {
			var $detail_window = $('.item_detail_container:eq(0)');
			var $detail_form = $('.item_detail_form', $detail_window);
			var $rule_form = $('.item_rule_form', $detail_window);

			// 更新详细配置
			var opt = $detail_form.serializeJson();
			if ((typeof(opt['options.label']) == 'object') && (typeof(opt['options.value']) == 'object')) {
				if (opt['options.label'] && opt['options.value']) {
					var options = [];
					for(var idx = 0; idx < opt['options.label'].length; idx ++) {
						if (!!opt['options.label'][idx] && !!opt['options.value'][idx]) {
							options.push({'label': opt['options.label'][idx], 'value': opt['options.value'][idx]});
						}
					}
					opt['options'] = options;
				}
			} else if ((typeof(opt['options.label']) == 'string') && (typeof(opt['options.value']) == 'string')) {
				var options = [{'label': opt['options.label'], 'value': opt['options.value']}];
				opt['options'] = options;
			}
			opt['options.label'] = undefined;
			opt['options.value'] = undefined;

			var $item = $detail_window.data().item;
			// 重新渲染指定对象
			render(opt, $item);

			// 如果通不过同名校验，则禁止进行修改rule的操作
			if (!checkSameName()) {
				return false;
			}

			// 更新校验规则
			var rule = $rule_form.serializeJson();
			log('更新后的校验规则>>>', rule);
			/*$.each(rule, function(key) {
				if 
			})*/
			log('更改前', $item.data().rule);
			$item.data().rule = rule;
			log('更改后', $item.data().rule);

			setFormRules();
		}
		$('.item_detail_container').remove();
	}

	// 弹出操作遮罩层（遮盖当前编辑对象）
	function config() {
		var ev = event;
		close_config();
		close_detail();
		var $this = $(ev.target);
		if ($this.closest('.drag_item').parent().hasClass('components_container')) {
			return false;
		}

		if ($this.closest('.drag_item').length > 0) {
			var control_bar = $(
				'<div class="control_bar">' +
					'<div class="control_bar_core">' +
						'<button type="button" class="btn btn-warning edit_btn btn_group_1">' +
							'<i class="fa fa-cog"></i>' +
						'</button>' +
						'<button type="button" class="btn btn-danger remove_btn btn_group_1">' +
							'<i class="fa fa-trash"></i>' +
						'</button>' +
						'<button type="button" class="btn btn-primary cancel_btn">' +
							'<i class="fa fa-close"></i>' +
						'</button>' +
					'</div>' +
				'</div>'
			);
			// control_bar.css({'left': info.x + 'px', 'top': info.y + 'px', 'width': info.w + 'px', 'height': info.h + 'px', 'line-height': info.h + 'px'});

			control_bar.find('.remove_btn').on('click', function() {
				$this.closest('.drag_item').remove();
				control_bar.remove();
				close_detail();
			});

			control_bar.find('.edit_btn').on('click', function() {
				control_bar.find('.btn_group_1').hide();
				// 弹出编辑窗口
				pop_detail($this.closest('.drag_item'));
			});

			control_bar.find('.cancel_btn').on('click', function() {
				close_detail();
				close_config();
			});

			// control_bar.on('mouseout', function() {
			// 	control_bar.remove();
			// })

			// $('body').append(control_bar);
			$this.closest('.drag_item').append(control_bar);
		}
	}

	// 关闭操作遮罩层
	function close_config() {
		$('.control_bar').remove();
	}



	// /////////////////////////////////////////////////////////////////////////////
	// 底部工具条
	// /////////////////////////////////////////////////////////////////////////////

	// 获取当前json配置
	function getJson() {
		var structured_json = {};
		var json_opts = [], json_rules = {};
		$.each($('.drop_container').children(), function() {
			json_opts.push($(this).data().opts);
			json_rules[$(this).data().opts.name] = $(this).data().rule;
		});
		structured_json = {
			'items': json_opts,
			'rules': json_rules};
		str_json = JSON.stringify(structured_json);
		str_json = formatCode(str_json);
		$('#modalContent').html('<textarea cols="30" rows="10" style="width: 100%; height: 280px;">' + str_json + '</textarea>');
		return structured_json;
	}

	// 根据当前json配置渲染form
	function renderJson() {
		var jsonConf = $.parseJSON($('#modalContent textarea').val());
		var json_opts = jsonConf['items'];
		var json_rules = jsonConf['rules'];

		log('json_opts', json_opts);
		log('json_rules', json_rules);

		clearAll();

		$.each(json_opts, function(_idx){
			var $item = render(this);

			$item.attr('id', 'drag-item-' + _idx);
			$item.attr('draggable', 'true');
			$item.on('dragstart', dragStart);
			$item.on('dragend', dragEnd);
			$item.on('dblclick', config);

			$item.removeClass('base');
			// 去掉重复id
			while (hasSameId($item.attr('id'))) {
				var id = $item.attr('id');
				var order = parseInt(id.split('-')[id.split('-').length - 1]) + 1;
				$item.attr('id', 'drag-item-' + order);
			}
			// 加入新对象
			$('.drop_container').append($item);

			$item.data().opts = this;
			$item.data().rule = json_rules[this.name];
		});

		setFormRules();
	}

	// 生成警告框
	function alertBox(loc) {
		var $box = $('<div class="alertBox"></div>');
		$box.css({
			'left': loc.x + 'px',
			'top': loc.y + 'px',
			'width': (loc.w + 30) + 'px',
			'height': loc.h + 'px'
		});
		return $box;
	}

	// 检查是否有重名的情况发生
	function checkSameName() {
		$('.alertBox').removeClass('alertBox');
		// 检查是否有重名，重名报错。
		var names = [];
		$.each($('#dropForm').children(), function() {
			names.push($(this).data().opts.name);
		});
		for (var i = 0; i < names.length; i ++) {
			for (var j = i + 1; j < names.length; j ++) {
				if (names[i] == names[j]) {
					alert('[ERROR] Same name found!');
					$($('#dropForm').children()[i]).addClass('alertBox');
					$($('#dropForm').children()[j]).addClass('alertBox');
					return false;
				}
			}
		}
		return true;
	}

	// 校验form
	function checkForm() {
		if (!checkSameName()){
			return false;
		}
		// 一切正常再提交检查规则
		$('#dropForm').submit();
	}

	function taggleMode() {
		$.each($('.taggleMode'), function(){
			var $this = $(this);
			if ($this.attr('disabled') !== undefined) {
				$this.removeAttr('disabled');
				$this.removeClass('btn-default');
				$this.addClass('btn-success');
			} else {
				$this.attr({"disabled": "disabled"});
				$this.removeClass('btn-success');
				$this.addClass('btn-default');
			}
		});
		if ($('.taggleMode:eq(0)').attr('disabled') === undefined) {
			$('.bg2').show();
			$('.bg').hide();
			$('#viewForm').renderForm(getJson());
		} else {
			$('.bg').show();
			$('.bg2').hide();
		}
	}



	// /////////////////////////////////////////////////////////////////////////////
	// 拖拽
	// /////////////////////////////////////////////////////////////////////////////
	
	// 初始化拖拽
	function drag_init() {
		var $containers = $('.page_content');
		$.each($containers, function(){
			$(this).on('dragover', dragOver);
			$(this).on('drop', drop);
		});

		var $drag_items = $('.drag_item');
		$.each($drag_items, function(idx){
			$(this).attr('id', 'drag-item-' + idx);
			$(this).attr('draggable', 'true');
			$(this).on('dragstart', dragStart);
			$(this).on('dragend', dragEnd);
			$(this).on('dblclick', config);
		});
	}

	// 拖拽开始
	function dragStart() {
		log('dragStart');
		var ev = event;

		close_config();
		close_detail();

		// 随拖拽准备的数据
		ev.dataTransfer.setData("id", ev.target.id);
		ev.dataTransfer.setData("node_html", $(ev.target)[0].outerHTML);
		
		// 确定拖拽模式
		if ($(ev.target).parent().hasClass('components_container')) {
			ev.dataTransfer.setData("move_mode", 'copy');
		} else {
			ev.dataTransfer.setData("move_mode", 'move');
		}

		// 页面变化
		$('.page_content').addClass('anime_alert');

		// 加入插入位置提示
		$.each($('.drop_container').children(), function() {
			var $item = $(this);
			var loc = getAbsoluteLocationInfo($item);
			var $insert_pointer = $('<div class="insert_pointer"></div>');
			$insert_pointer.css({
				'left': loc.x + 'px',
				'top': loc.y + 'px',
				'width': '10px',
				'height': (loc.h - 2) + 'px'
			});
			// 互相绑定
			$item.data().insert_pointer = $insert_pointer;
			$insert_pointer.data().item = $item;
			$('body').append($insert_pointer);
		});

		$('.drop_container').append('<div class="append_holder col-sm-12"></div>');

		location_list = [];
		$.each($('.drop_container').children(), function(){
			location_list.push(getAbsoluteLocationInfo($(this)));
		});
	}

	// 扔下
	function drop() {
		log('drop');
		var ev = event;
		ev.preventDefault();
		var origin_id = ev.dataTransfer.getData("id");

		log('drop mode ->', ev.dataTransfer.getData('move_mode'));

		// 复制模式
		if (ev.dataTransfer.getData('move_mode') == 'copy') {
			var new_node = $(ev.dataTransfer.getData("node_html"));
			new_node.removeClass('base');
			// 复制模式需要重新绑定事件
			new_node.on('dragstart', dragStart);
			new_node.on('dragend', dragEnd);
			new_node.on('dblclick', config);

			// 去掉重复id
			while (hasSameId(new_node.attr('id'))) {
				var id = new_node.attr('id');
				var order = parseInt(id.split('-')[id.split('-').length - 1]) + 1;
				new_node.attr('id', 'drag-item-' + order);
			}
			

			// 加入新对象
			if ($('.insert_mark').hasClass('append_holder')) {
				$('.insert_mark').replaceWith(new_node);
			} else {
				$('.insert_mark').data().item.before(new_node);					
			}

			new_node.data().opts = $('#' + origin_id).data().opts;
			// 为了防止name相同bug，暂时采用重置name的方法，以后需要解决
			// TODO
			var new_name = new_node.data().opts.name + '_' + randomId();
			new_node.data().opts.name = new_name;

			new_node.data().rule = $('#' + origin_id).data().rule;
			// 重新渲染，以生成需要用到的随机id
			render(new_node.data().opts, new_node);
			log('after render');
			setFormRules();
		}
		// 移动模式
		else {
			if ($('.insert_mark').hasClass('append_holder')) {
				$('.insert_mark').replaceWith($('#' + origin_id));
			} else {
				$('.insert_mark').data().item.before($('#' + origin_id));					
			}
		}
	}

	// 拖拽结束
	function dragEnd() {
		log('dragEnd');
		var ev = event;
		$('.page_content').removeClass('anime_alert');
		cancelAnimationFrame(anime);
		$('.insert_mark').removeClass('insert_mark');
		$('.append_holder').remove();
		$('.insert_pointer').remove();
	}

	// 拖拽经过
	function dragOver() {
		var ev = event;
		ev.preventDefault();

		$('.insert_mark').removeClass('insert_mark');

		if ($(ev.toElement).closest('.drag_item').length > 0) {
			$(ev.toElement).closest('.drag_item').data().insert_pointer.addClass('insert_mark');
		} else {
			$('.append_holder:last').addClass('insert_mark');
		}
	}



	// /////////////////////////////////////////////////////////////////////////////
	// 校验 - Validator
	// /////////////////////////////////////////////////////////////////////////////

	// 初始化form校验器
	function initValidator() {
		log('[校验] 初始化-前，dropFormValidator =', dropFormValidator);
		$.validator.setDefaults({
			debug: true,
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
		dropFormValidator = $('#dropForm').validate();
		log('[校验] 初始化-后，dropFormValidator =', dropFormValidator);
	}

	// 配置form校验规则
	function setFormRules() {
		log('[校验] 设置（重设）表单校验规则-前');
		var formRules = {};
		var $form = $('#dropForm');
		$.each($form.children(), function(){
			var $this = $(this);
			if (!$this.hasClass('append_holder')) {
				if ($this.data().rule === undefined) {
					$this.data().rule = rule[$this.data().opts.type];
				}
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
			}
		});

		// 清空表单
		/*if (dropFormValidator) {
			dropFormValidator.resetForm();
		}*/

		log('[校验] 设置（重设）表单校验规则-后');
	}



	// /////////////////////////////////////////////////////////////////////////////
	// 工具类方法
	// /////////////////////////////////////////////////////////////////////////////

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

	// 随机id(固定前缀)
	function randomId(prefix){
		return ( prefix || '' ) + ( new Date().valueOf().toString(36)+Math.random().toString(36) ).split('0.').join('_').toUpperCase();
	}

	// 判断当前id是否有重复的
	function hasSameId(id) {
		var elements = $('[id^="' + id + '"]');
		var id_same_count = 0;
		if (elements.length >= 1) {
			$.each(elements, function() {
				if ($(this).attr('id') == id) {
					id_same_count += 1;
				}
			});
		}
		if (id_same_count >= 1) {
			return true;
		} else {
			return false;
		}
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

	// 从事件获取鼠标相的绝对坐标
	function mouseCoords(ev) { 
		if(ev.pageX || ev.pageY) { 
			return {x: ev.pageX, y: ev.pageY}; 
		} 
		return { 
			x:ev.clientX + document.body.scrollLeft - document.body.clientLeft, 
			y:ev.clientY + document.body.scrollTop - document.body.clientTop 
		};
	}

	// 获取Jquery对象绝对布局下的坐标、宽高
	function getAbsoluteLocationInfo($obj) {
		return {
			x: $obj.offset().left,
			y: $obj.offset().top,
			w: $obj.width(),
			h: $obj.height()
		}
	}

	// 鼠标是否在当前对象“之前”	
	function isBefore(mouseInfo, thisInfo) {
		if (mouseInfo.x < (thisInfo.x + thisInfo.w) && mouseInfo.y >= thisInfo.y && mouseInfo.y <= (thisInfo.y + thisInfo.h)) {
			return true;
		} else {
			return false;
		}
	}

	// 清除全部内容
	function clearAll() {
		$('.drop_container').children().remove();
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