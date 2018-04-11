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
	$.fn.bindPopup = function(_opts) {
		var default_opts = {
			width: '800px',
			height: '600px',
			beforePop: function(node) {

			},
			beforeRecover: function(node){

			},
			popCallback: function() {
				// do nothing
			},
			recoverCallback: function() {
				// do nothing
			}
		};

		var opts = $.extend({}, default_opts, _opts);

		if ($('#style_anime_keyframes_pop').length == 0) {
			$('head').append('<style id="style_anime_keyframes_pop">\n</style>');
		}
		if ($('#style_anime_keyframes_recover').length == 0) {
			$('head').append('<style id="style_anime_keyframes_recover">\n</style>');
		}

		$(this).on('click', function(){
			var i = $(this);
			// RECOVER
			if (i.hasClass('pop')) {
				var dm = i.data().dummy;

				/*i.css({
					"width": i.width() + "px",
					"height": i.height() + "px",
					"line-height": i.height() + "px",
					"position": "fixed",
					"left": i.offset().left - $(document).scrollLeft() + "px",
					"top": i.offset().top - $(document).scrollTop() + "px"
				});*/
				i.css({
					"width": i.width() + "px",
					"height": i.height() + "px",
					"line-height": i.height() + "px",
					"position": "absolute",
					"left": i.offset().left - dm.offset().left + 16 + "px",
					"top": i.offset().top - dm.offset().top + 1 + "px"
				});
				i.removeClass('pop');

				$('#style_anime_keyframes_recover').html(
					'@keyframes recover {\n' +
					'	100% {\n' +
					'		width: ' + dm.width() + 'px;\n' +
					'		height: ' + dm.height() + 'px;\n' +
					'		line-height: ' + dm.height() + 'px;\n' +
					'		position: absolute;\n' +/*
					'		left: ' + (dm.offset().left - parseInt(dm.css('margin-left').replace(/px/g, '')) - $(document).scrollLeft()) + 'px;\n' +
					'		top: ' + (dm.offset().top - parseInt(dm.css('margin-top').replace(/px/g, '')) - $(document).scrollTop() - 60) + 'px;\n' +*/
					'		left: ' + 16 + 'px;\n' +
					'		top: ' + 1 + 'px;\n' +
					'		z-index: 99999;\n' +
					'	}\n' +
					'}\n'
				);
				i.addClass('recover');

				$('.easy-show-anime').removeClass('easy-show-anime').addClass('easy-hide-anime');
				opts.beforeRecover(i, opts);

				setTimeout(function(){
					dm.replaceWith(i);
					i.removeClass('recover');
					i.data().dummy = '';
					i.removeAttr('style');
					$('.easy-hide-anime').remove();
					opts.recoverCallback();
				}, 250);
			}
			// POP
			else {
				var dummy_html = i.prop('outerHTML');
				i.css({
					"width": i.width() + "px",
					"height": i.height() + "px",
					"line-height": i.height() + "px",
					"position": "fixed",
					"left": (i.offset().left - $(document).scrollLeft()) + "px",
					"top": (i.offset().top - $(document).scrollTop()) + "px",
					"z-index": "99999"
				});
				i.data().dummy = $(dummy_html).addClass('dummy');
				i.before(i.data().dummy);

				var left_offset = (($(window).width() - parseInt(opts.width.replace(/px/g, ''))) / 2).toFixed(2) + 'px';
				var top_offset = (($(window).height() - parseInt(opts.height.replace(/px/g, ''))) / 2).toFixed(2) + 'px';

				$('#style_anime_keyframes_pop').html(
					'@keyframes pop {\n' +
					'	100% {\n' +
					'		width: ' + opts.width + ';\n' +
					'		height: ' + opts.height + ';\n' +
					'		line-height: ' + opts.height + ';\n' +
					'		position: fixed;\n' +
					'		left: ' + left_offset + ';\n' +
					'		top:  ' + top_offset + ';\n' +
					'		z-index: 99999;\n' +
					'	}\n' +
					'}\n'
				);

				i.addClass('pop');
				$('body').append('<div class="mask-layer easy-show-anime"></div>');
				opts.beforePop(i, opts);

				setTimeout(function(){
					opts.popCallback();
				}, 250);
			}
		});
	}
}));
