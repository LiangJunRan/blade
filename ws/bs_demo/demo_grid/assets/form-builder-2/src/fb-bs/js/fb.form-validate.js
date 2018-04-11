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






		
	
}));



