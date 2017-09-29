;(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Dom7'], factory);
	} else {
		factory(window.Dom7);
	}
}(function ($, undefined) {
	$.formb = $.formb || {};

	$.formb.components = $.formb.components || {};
	var baseComponent = $.formb.baseComponent;

	var component_textarea = function(kargs) {
		baseComponent.apply(this, arguments);

		var that = this;

		this.template =
			'<span class="multimedia-group">' +
				'<input type="hidden" name="{name}" />' +
				'<span class="showValue"></span>' +
			'</span>';

		this.__beforeRender = function() {
			this.opts.addonIconClass = 'right';
		}

		this.__render = function() {
			this.$node = $(this.template.format(this.opts));
			this.$node.attr('placeholder', this.opts.placeholder);
			this.$node.attr('onfocus', 'this.placeholder=""');
			this.$node.attr('onblur', 'this.placeholder="' + this.opts.placeholder + '"');
			// this.$node.attr('readonly', this.opts.readonly || false);

			// 给用来存值的input对象加change监听，如果值改变，只有可能是setFormValue执行造成的
			this.$node.find('input').on('change', function(e) {
				var value = e.target.value;
				// console.log('value ->', value);
				that.setValue(value);
			});

			this.$node.on('click', this.editCallback);
		}

		this.__setValue = function(value) {
			// console.log('textarea / this.__setValue(' + value + ')');

			// console.log(this.$node.find('input'));

			this.$node.find('input').val(value);
			this.$node.find('.showValue').html(value);
		}

		this.editCallback = function(e) {
			myApp.closeModal();

			var popupTemplate =
					'<div class="popup textarea-popup view">'+
						'<div class="navbar">' +
							'<div class="navbar-inner">' +
								'<div class="left">' +
									'<a href="#" class="close-popup">' +
										'<span>' +
											'<div class="navbar-btn nbg">取消</div>' +
										'</span>' +
									'</a>' +
								'</div>' +
								'<div class="center sliding lessonTitle">{title}</div>' +
								'<div class="right submitBtn disabled">' +
									'<a href="#" class="link close-popup textarea-popup-submit">' +
										'<span>' +
											'<div class="navbar-btn">完成</div>' +
										'</span>' +
									'</a>' +
								'</div>' +
							'</div>' +
						'</div>' +
						
						'<div class="navbar-through">' +
							'<div class="page-content">' +
								'<div class="list-block">' +
									'<ul>' +
										'<li class="align-top">' +
											'<div class="item-content">' +
												'<div class="item-inner">' +
													'<div class="item-input">' +
														'<textarea id="textEdit">{value}</textarea>' +
													'</div>' +
												'</div>' +
											'</div>' +
										'</li>' +
									'</ul>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>';

			myApp.popup(popupTemplate.format({
				title: that.opts.label,
				value: that.value || ""
			}));

			// 联动事件绑定
			$('#textEdit').on('input', function(e) {
				// console.log('input');
				// if ($(e.target).val().trim().length > 0) {
				// 	$(e.target).closest('.textarea-popup').find('.submitBtn').removeClass('disabled');
				// } else {
				// 	$(e.target).closest('.textarea-popup').find('.submitBtn').addClass('disabled');
				// }
				$(e.target).closest('.textarea-popup').find('.submitBtn').removeClass('disabled');
			});

			// 提交事件绑定
			$('.textarea-popup-submit').on('click', function() {
				var value = $('#textEdit').val();
				that.setValue(value);
			});
				
		}
	}

	$.formb.components.textarea = component_textarea;

}));