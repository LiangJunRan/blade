function bindPopup(selector, event, copts) {
	var _opts = {
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
	}
	var opts = $.extend({}, _opts, copts);

	if ($('#style_anime_keyframes_pop').length == 0) {
		$('head').append('<style id="style_anime_keyframes_pop">\n</style>');
	}
	if ($('#style_anime_keyframes_recover').length == 0) {
		$('head').append('<style id="style_anime_keyframes_recover">\n</style>');
	}

	$(selector).on(event, function(){
		var i = $(this);
		// RECOVER
		if (i.hasClass('pop')) {
			i.css({
				"width": i.width() + "px",
				"height": i.height() + "px",
				"position": "fixed",
				"left": i.offset().left + "px",
				"top": i.offset().top + "px"
			});
			i.removeClass('pop');

			var dm = i.data().dummy;

			$('#style_anime_keyframes_recover').html(
				'@keyframes recover {\n' +
				'	100% {\n' +
				'		width: ' + dm.width() + 'px;\n' +
				'		height: ' + dm.height() + 'px;\n' +
				'		position: fixed;\n' +
				'		left: ' + (dm.offset().left - parseInt(dm.css('margin-left').replace(/px/g, '')) - $(document).scrollLeft()) + 'px;\n' +
				'		top: ' + (dm.offset().top - parseInt(dm.css('margin-top').replace(/px/g, '')) - $(document).scrollTop()) + 'px;\n' +
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
