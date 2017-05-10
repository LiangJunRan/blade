;(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define([ "jquery" ], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
}(function ($) {
    $.fn.pop_show = function (_opts) {
    	var trigger = $(this);
    	var default_opts = {
			content: '气泡demo',
			position: 'right',
			offset: {
				x: 0,
				y: 0
			},
			only_one: true,
			delay: 3000
		};

		var opts = $.extend(true, {}, default_opts, _opts);

		if (opts.only_one) {
			$.each($('.pop_tips'), function(){
				clearTimeout($(this).data().auto_remove_timer);
			});
			$('.pop_tips').remove();
		}


		// 计算位置
		var left = trigger.offset().left;
		var top = trigger.offset().top;
		var pop_tips_trangle_class = 'pop_tips_trangle_';

		if (opts.position == 'right') {
			left += trigger.width() + 32;
			top += trigger.height() / 2;
			pop_tips_trangle_class += 'left';
		}
		if (opts.position == 'center') {
			left += (trigger.width() - 160) / 2;
			top += trigger.height() / 2;
			pop_tips_trangle_class += 'none';
		}
		left += opts.offset.x;
		top += opts.offset.y;

		// 绘制
		var pop_tips = $(
			'<div class="pop_tips">' + 
				'<div class="pop_tips_trangle_container">' +
					'<div class="' + pop_tips_trangle_class + ' anime_alert"></div>' +
				'</div>' + 
				'<div class="pop_tips_content anime_alert">' + opts.content  + '</div>' +
			'</div>');

		pop_tips.css({'left': left, 'top': top});
		pop_tips.data().time_left = opts.delay;

		// 鼠标悬停，暂停并重置消失倒计时
		pop_tips.on('mouseover', function() {
			$(this).data().time_left = opts.delay;
			clearTimeout($(this).data().auto_remove_timer);
			$(this).removeClass('anime_remove');
		})
		// 鼠标离开，开始消失倒计时
		.on('mouseout', function(){
			auto_remove();
		});

		// 每帧自动检测是否需要自动消失
		function auto_remove() {
			pop_tips.data().time_left -= 16;

			if (pop_tips.data().time_left <= 700) {
				if (!pop_tips.hasClass('anime_remove')){
					pop_tips.addClass('anime_remove');
				}
			}
			if (pop_tips.data().time_left <= 0) {
				pop_tips.remove();
			}
			pop_tips.data().auto_remove_timer = setTimeout(auto_remove, 16);
		}
		$('body:eq(0)').append(pop_tips);
		auto_remove();
    };
}));