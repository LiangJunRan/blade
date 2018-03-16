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
	window.qiniu_upload = function(opts) {
		/*var formData = new FormData();
		
		// TODO: 改成从后台获取token

		formData.append('file', opts.data.file);
		formData.append('key', opts.data.key);*/

		if (!opts.data.token && !!opts.token_url) {
			$.ajax({
				url: opts.token_url,
				success: function(d) {
					opts.data.token = d;

					do_upload(opts);
				}
			})
		} else {
			do_upload(opts);
		}

		function do_upload(opts) {
			var fd = new FormData();
			$.each(opts.data, function(key) {
				fd.append(key, opts.data[key]);
			});

			$.ajax({
				url: 'http://up-z1.qiniu.com',
				method: 'POST',
				data: fd,
				processData: false,
				contentType: false,
				/*xhr: function(){
					myXhr = $.ajaxSettings.xhr();	 
					if(myXhr.upload){
						myXhr.upload.addEventListener('progress',function(e) {
							// console.log(e);
							if (e.lengthComputable) {
								var percent = e.loaded/e.total*100;
								$progress.html('上传：' + e.loaded + "/" + e.total+" bytes. " + percent.toFixed(2) + "%");
							}
						}, false);
					}
					return myXhr;
				},*/
				beforeSend: function(xhr) {
					console.log('BEFORESEND', xhr);
					if (opts.beforeSend) {
						opts.beforeSend(xhr);
					}
				},
				success: function(res) {
					console.log('SUCCESS', res);
					if (opts.success) {
						opts.success(res);
					}
				},
				error: function(res) {
					console.log('ERROR', res);
					if (opts.error) {
						opts.error(res);
					}
				},
				complete: function(res, ts) {
					console.log('COMPLETE', res, ts);
					if (opts.complete) {
						opts.complete(res, ts);
					}
				}
			});
		}

		
	}
}));