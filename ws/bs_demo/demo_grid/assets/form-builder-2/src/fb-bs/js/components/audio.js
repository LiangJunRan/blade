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

	$.formb.components = $.formb.components || {};
	var baseComponent = $.formb.baseComponent;

	var component_audio = function(kargs) {
		baseComponent.apply(this, arguments);// 执行基类的初始化

		this.template =  
				'<div class="component">' +
					'<input type="hidden" name="{name}"/>' +
					'<span class="record-part">' +
						// 录音按钮、试听按钮、上传按钮、清空按钮
						'<div class="recorder-placeholder" style="height: 34px; line-height: 34px; background-color: #eee; padding-left: 10px;">--录音部分，待渲染--</div>' +
					'</span>' +
					'<span class="play-part hide">' +
						// 目前只支持html5的方法
						'<audio class="fb-audio" controls="controls">您的浏览器不支持该功能</audio>' +
						'<button type="button" class="btn btn-danger delete"><i class="fa fa-close"></i></button>' +
					'</span>' +
					'<div class="help-block-error"></div>' +
				'</div>';
		this.recorderTemplate =
				'<div class="recorder">' +
					'<span class="record-btn-part">' +
						'<button class="btn btn-default record-btn" type="button"><i class="fa fa-circle"></i><span>&nbsp;REC</span></button>' +
					'</span>' +
					'<span class="test-btn-part hide" style="margin-left: 8px;">' +
						'<audio class="fb-audio" controls="controls"></audio>' +
						'<button class="btn btn-default upload-btn" type="button" style="margin-left: 8px;"><i class="fa fa-upload"></i><span></span></button>' +
						'<button class="btn btn-danger reset-btn" type="button" style="margin-left: 8px;"><i class="fa fa-close"></i><span></span></button>' +
					'</span>' +
					'<p class="help-info form-control-static" style="padding-left: 9px;"></p>' +
				'</div>';

		var that = this ;

		this.__render = function() {

			this.$node = $(this.template.format(this.opts));

			this.$node.find('input').on('change', function(e) {
				var value = e.target.value;
				that.setValue(value);
                $(this).trigger('keyup');
			});

			// 渲染录音部分
			// this.$node.find('.recorder-placeholder').renderRecorder();
			var $recorderNode = $(this.recorderTemplate);
			this.$node.find('.recorder-placeholder').replaceWith($recorderNode);

			var recorder;

			var audio = $recorderNode[0].querySelector('audio');

			/*// 结束监听
			audio.addEventListener('ended', function() {
				$recorderNode.find('.test-btn .playIcon').addClass('fa-play').removeClass('fa-stop');
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
				
				// 将临时文件存起来，以备上传使用
				that.tempFile = recorder.getBlob();

				// 录完音立刻关闭audioContext避免超出最大值
				recorder.close();

				console.log('当前录音值为:', recorder.getBlob());
			}

			console.log($recorderNode.find('.record-btn').toggle);

			// 录音按钮事件绑定
			$recorderNode.find('.record-btn').on('click', function() {
				that.$node.find('.help-info').html('');
				var $recordIcon = $recorderNode.find('.record-btn .fa-circle');
				if ($recordIcon.hasClass('active')) {
					// 结束录音
					stopRecording();
					$recordIcon.removeClass('active');

					// 显示预览部分
					$recorderNode.find('.test-btn-part').removeClass('hide');
				} else {
					// 开始录音
					startRecording();
					$recordIcon.addClass('active');

					// 隐藏预览部分
					$recorderNode.find('.test-btn-part').addClass('hide');
				}
			});

			// 上传按钮的绑定
			$recorderNode.find('.upload-btn').on('click', function() {
				var opt = {
					data: {
						file: that.tempFile,
						key: that.opts.name + '_0_' + (new Date()).valueOf() + '.wav'
					},
					success: function(res) {
						console.log('upload success');
						var domain = $('#qiniuDomain').val();
						that.setValue("audios:[" + domain + res.key + "]");
					},
					error: function(res) {
						console.log('upload error.', res);
						that.$node.find('.help-info').html($.parseJSON(res.responseText)['error']);
					}
				};

				qiniu_upload(opt);
			});

			// 清空按钮的绑定
			$recorderNode.find('.reset-btn').on('click', function() {
				audio.setAttribute('src', null);
				that.$node.find('.help-info').html('');

				$recorderNode.find('.test-btn-part').addClass('hide');
			});


			// 删除按钮事件绑定
			this.$node.find('.play-part .delete').on('click', function(e) {
				that.setValue('');
			});
			if(that.opts.isRead) {

                this.$node.find('.play-part .delete').remove();

			}
		}


		// 播放和录音部分切换显示
		this.__partDisplayChange = function() {
			if (this.value.match(/audios:\[(.*)\]/) !== null) {
				this.$node.find('.play-part').removeClass('hide');
				this.$node.find('.record-part').addClass('hide');
				this.$node.find('.test-btn-part').addClass('hide');
				this.$node.find('.help-info').html('');
			} else {
				this.$node.find('.play-part').addClass('hide');
				this.$node.find('.record-part').removeClass('hide');
			}
		}


		this.__setValue = function(data) {
			console.log('audio / this.__setValue("' + data + '")');


			if(that.opts.isRead){
                // 当没有值的时候
                if(data === '') {
                    this.$node.attr('hidden',true);
                } else {
                    this.$node.removeAttr('hidden');

                }
			}

            this.$node.find('input').val(data);
            var url = "";

            if (data && data.match(/audios:\[(.*)\]/) !== null) {
                url = data.match(/audios:\[(.*)\]/)[1].split(',')[0];
            }

            // 给播放部分的audio赋值
            this.$node.find('.play-part audio').attr('src', url);


            // 给播放部分的audio赋值
            console.log('给播放部分的audio赋值，发现' + this.$node.find('.play-part audio').length + '个')
            this.$node.find('.play-part audio').attr('src', url);
            console.log('复制完毕后:', this.$node.find('.play-part audio')[0].outerHTML);
            
			if (that.opts.isRead) {
				this.$node.find('.delete').hide();
			} else {
				this.$node.find('.delete').show();
			}
		};


		this.__afterSetValue = function(data) {
			this.__partDisplayChange();
		}

	};

	$.formb.components.audio = component_audio;
}));