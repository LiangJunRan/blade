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
	$.fn.renderRecorder = function() {
		var $nodes = $(this);
		$.each($nodes, function(idx) {
			var $this = $($nodes[idx]);

			var template =
					'<div class="recorder">' +
						'<span class="record-btn-part">' +
							'<button class="btn btn-default record-btn" type="button"><i class="fa fa-circle"></i><span>&nbsp;REC</span></button>' +
						'</span>' +
						'<span class="test-btn-part hide" style="margin-left: 8px;">' +
							'<audio class="fb-audio" controls="controls"></audio>' +
							'<button class="btn btn-default upload-btn" type="button" style="margin-left: 8px;"><i class="fa fa-upload"></i><span></span></button>' +
							'<button class="btn btn-danger reset-btn" type="button" style="margin-left: 8px;"><i class="fa fa-close"></i><span></span></button>' +
						'</span>' +
					'</div>';

			var $that = $(template);
			$this.replaceWith($that);

			var recorder;

			var audio = $that[0].querySelector('audio');
			
			/*// 结束监听
			audio.addEventListener('ended', function() {
				$that.find('.test-btn .playIcon').addClass('fa-play').removeClass('fa-stop');
			}, false);*/

			function startRecording() {
				HZRecorder.get(function (rec) {
					recorder = rec;
					recorder.start();
				});
			}
			function stopRecording() {
				recorder.stop();
				recorder.play(audio);

				console.log('当前录音值为:', recorder.getBlob());
			}

			console.log($that.find('.record-btn').toggle);

			// 录音按钮事件绑定
			$that.find('.record-btn').on('click', function() {
				var $recordIcon = $that.find('.record-btn .fa-circle');
				if ($recordIcon.hasClass('active')) {
					// 结束录音
					stopRecording();
					$recordIcon.removeClass('active');

					// 显示预览部分
					$that.find('.test-btn-part').removeClass('hide');
				} else {
					// 开始录音
					startRecording();
					$recordIcon.addClass('active');

					// 隐藏预览部分
					$that.find('.test-btn-part').addClass('hide');
				}
			});

			/*// 测试播放按钮的事件绑定
			$that.find('.test-btn').on('click', function() {
				var $playIcon = $that.find('.test-btn .playIcon');
				if ($playIcon.hasClass('fa-play')) {
					// 开始放音
					audio.play();
					$playIcon.removeClass('fa-play').addClass('fa-stop');
				} else {
					// 结束放音
					audio.pause();
					$playIcon.addClass('fa-play').removeClass('fa-stop');
				}
			});*/

			// 上传按钮的绑定
			$that.find('.upload-btn').on('click', function() {
				console.log('TODO: Upload');
			});

			// 清空按钮的绑定
			$that.find('.reset-btn').on('click', function() {
				audio.setAttribute('src', null);

				$that.find('.test-btn-part').addClass('hide');
			});

		});	// END of $.each

	}
}));