;(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Dom7'], factory);
	} else {
		factory(window.Dom7);
	}
}(function ($, undefined) {
	$.formb = $.formb || {};

	var cpts = $.formb.components;


	$.fn.renderForm = function(jsonConf) {
		var $form = $(this);
		// 初始化校验器
		// initValidator($form);

		// 渲染生成form
		renderJson($form, jsonConf);

		// 加校验
		// afterAllAjaxCompleteDo(deferredObjectList, setFormRules, [$form]);

		// 加联动
		// activeEventBinds($form, jsonConf.events);

		// 赋初值
		setFormValue($form, jsonConf.values);
	}


	// 针对容器才有的方法和变量，如果做multimedia控件，也需要实现下以下方法。
	var labelTemplate =
			'<li>' +
				'<a href="#" class="item-with-addon">' +
					'<div class="item-content">' +
						'<div class="item-inner">' +
							'<div class="item-title">{label}</div>' +
							'<div class="addon addon-edit">' +
								'<i class="f7-icons size-smaller">{addonIconClass}</i>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</a>' +
			'</li>';
	var contentTemplate =
			'<li class="swipeout">' +
				'<div class="swipeout-content item-content">' +
					'<div class="item-inner">' +
						'<div class="item-after"></div>' +
					'</div>' +
				'</div>' +
				'<div class="swipeout-actions-right">' +
					// '<a href="#" class="edit-text bg-lightblue">Edit</a>' +
					'<a href="#" class="swipeout-clean bg-red">删除</a>' +
					// '<a href="#" class="swipeout-delete">删除</a>' +
				'</div>' +
			'</li>';
	var formGroupTemplate =
			'<div class="list-block formGroupItem">' +
				'<ul>' +
				'</ul>' +
			'</div>';

	function appendTo(component, $container) {
		
		// TODO: 考虑下group的事儿

		var $formGroupItem = $(formGroupTemplate);

		var opts = component.opts;

		// 渲染label
		var $label = $(labelTemplate.format(opts));
		$label.find('.addon-edit').on('click', component.editCallback);

		// 渲染content
		var $content = $(contentTemplate.format(opts));
		$content.find('.item-after').append(component.$node);
		// 清空当前对象的按钮
		$content.find('.swipeout-clean').on('click', function(e) {
			var el = $(e.target).closest('.swipeout');
			// 模仿swipe删除操作
			if (el.length === 0)
				return;
            if (el.length > 1)
            	el = $(el[0]);
            el.css({height: el.outerHeight() + 'px'});
            var clientLeft = el[0].clientLeft;
			el.css({height: 0 + 'px'}).addClass('deleting transitioning').transitionEnd(function () {
            	// 删除完毕操作
                el.removeClass('deleting transitioning swipeout-opened');
                el.find('.swipeout-content').css('transform', 'initial');
                el.find('.swipeout-actions-opened').removeClass('swipeout-actions-opened').children().css('transform', 'initial');
            	
            });
			// 清空数据
			$(e.target).closest('.formGroupItem').data('component').setValue('');
		});

		$formGroupItem.find('ul').append($label);
		$formGroupItem.find('ul').append($content);

		// 给当前groupItem暴露component对象，方便以后操作
		$formGroupItem.data('component', component);

		$container.append($formGroupItem);
	}



	// 根据json渲染form的内容
	function renderJson($form, jsonConf) {
		var json_opts = jsonConf['items'];
		var json_rules = jsonConf['rules'];
		var json_values = jsonConf['values'];
		var global_isRead = jsonConf['isRead'];
		var global_isSteam = jsonConf['isSteam'];

		$.each(json_opts || [], function(_idx){
			// 渲染出组件，只是组件自己，没有label之类的
			var componentClass = cpts[json_opts[_idx].type];
			if (componentClass === undefined) {
				console.error('组件[{type}]未找到对应的class定义'.format({type: json_opts[_idx].type}));
			} else {
				var name = json_opts[_idx].name;
				var component = new componentClass({
					'opts': json_opts[_idx],
					'rule': json_rules[name],
					'value': json_values[name],
					'global_isRead': global_isRead,
					'global_isSteam': global_isSteam
				});
				component.render();

				// 加入新对象
				appendTo(component, $form);
			}
			
		});
	}


	// 给表单赋值的方法
	function setFormValue($form, values) {
		var formId = $form.attr('id');
		myApp.formFromData('#' + formId, values || {});
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