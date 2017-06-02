;(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define([ "jquery" ], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
}(function ($) {
	var debugMode = true;	// 设置为true可以在console中看到详细信息

	$(document).ready(function(){
		// localSave绑定
		$('body').delegate('[localStorage]', 'input', function(){
			var $this = $(this);
			if (isOK($this)) {
				var itemKey 	= getItemKey($this);
				var key 		= getKey($this);
				var value 		= $this.val();
				var expireTime = getExpireTime($this);
				localSave(itemKey, key, value, expireTime);
			}
		});

		// 最开始自动加载localLoad的值
		localInitLoad();
	});

	function localInitLoad() {
		$.each($('[localStorage]'), function(){
			var $this = $(this);
			if (isOK($this)) {
				var itemKey = getItemKey($this);
				var key 	= getKey($this);
				$this.val(localLoad(itemKey, key));
			}
		});
	}

	// 检查是否可用
	function isOK($obj) {
		if (!!($obj.attr('name')) || !!($obj.attr('id'))) {
			return true;
		} else {
			err('[NG] 使用localStorage的jQuery对象必须拥有id或name属性！');
			return false;
		}
	}

	function getItemKey($obj) {
		return $obj.attr('localStorage').split('@')[0];
	}

	function getExpireTime($obj) {
		info('读取到的过期时间（毫秒）=' + $obj.attr('localStorage').split('@')[1]);
		return $obj.attr('localStorage').split('@')[1];
	}

	// 获取key值的方法
	function getKey($obj) {
		return $obj.attr('id') || $obj.attr('name');
	}

	// 本地存储的实现
    function localSave(itemKey, key, value, liveMillsecond) {
    	deleteExpiredItem();
    	// liveMillsecond=-1	为无限期
    	
		var ls = $.parseJSON(localStorage.getItem(itemKey) || '{}');

		// TODO: 更新过期时间
		var d = new Date();
		liveMillsecond = liveMillsecond || (7 * 24 * 3600 * 1000);
		info('最终的生命周期（毫秒）=' + liveMillsecond);
		var __expire_timestamp__ = 0;
		if (liveMillsecond != -1) {
			__expire_timestamp__ = d.valueOf() + liveMillsecond;
		} else {
			__expire_timestamp__ = -1;
		}
		ls = $.extend(true, {}, ls, {'__expire_timestamp__': __expire_timestamp__});
		var jsonValue = {};
		jsonValue[key] = value;
		ls = JSON.stringify($.extend(true, {}, ls, jsonValue));
		localStorage.setItem(itemKey, ls);
    };

    function localLoad(itemKey, key) {
    	deleteExpiredItem();

		var ls = $.parseJSON(localStorage.getItem(itemKey) || '{}');
		var __expire_timestamp__ = ls.__expire_timestamp__ || -1;
		// TODO: 判断是否过期
		var now = new Date();
		if (__expire_timestamp__ != -1 && now.valueOf() <= __expire_timestamp__) {
			info('还剩' + (__expire_timestamp__ - now.valueOf()) / 1000 + '秒 过期');
			var keys = key.split('.');
			var result = ls;
			$.each(keys, function(){
				try {
				   //在此运行代码
				   result = result[this];
				} catch(e) {
				   //在此处理错误
				   err('[ERROR]', e);
				}
			});
			return result;
		} else {
			localStorage.removeItem(itemKey);
			warn('LOAD 本地存储过期');
		}
    };

    function err(msg) {
    	if (console) {
    		console.error(msg);
    	} else {
    		alert(msg);
    	}
    }

    function info(msg) {
    	if (console && debugMode) {
    		console.info(msg);
    	}
    }

    function warn(msg) {
    	if (console && debugMode) {
    		console.warn(msg);
    	}
    }

    // 删除过期的对象
    function deleteExpiredItem() {
    	$.each(localStorage, function (itemKey) {
    		var jsonData = undefined;
    		try {
    			jsonData = $.parseJSON(localStorage.getItem(itemKey));
    		} catch (e) {
    			var msg = e.message;
    			if ((e.name == 'SyntaxError') && !!(msg.match(/Unexpected\ token\ .*\ in\ JSON/g)).length) {
    				warn('Not a jsonSting, pass');
    			} else {
    				throw e;
    			}
    		}
    		if (jsonData) {
				var __expire_timestamp__ = jsonData.__expire_timestamp__ || -1;
	    		if (__expire_timestamp__ != -1) {
	    			var now = new Date();
	    			if (now.valueOf() > __expire_timestamp__) {
	    				// 过期，删除
	    				localStorage.removeItem(itemKey);
	    			}
	    		}
    		}
    	});
    }

}));