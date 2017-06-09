/*
	Author: kuroikenshi@sina.com
	Update: 2017-06-06 11:22:32
*/
;(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define([ "jquery" ], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
}(function ($) {
	var debugMode = false;	// 设置为true可以在console中看到详细信息

	$(document).ready(function(){
		// localSave绑定
		$('body').delegate('[localStorage]', 'input', function(){
			var $this = $(this);
			if (isOK($this)) {
				var itemKey 	= getItemKey($this);
				var key 		= getKey($this);
				var value 		= $this.val();
				var expireTime 	= getExpireTime($this);
				info('[localSave]         ' + itemKey + '.' + key + '=' + value + ' expireTime=' + expireTime);
				localSave(itemKey, key, value, expireTime);
				info('[localSave]         ' + itemKey + '.' + key + ' is saved');
			}
		});

		// 最开始自动加载localLoad的值
		localInitLoad();
	});

	function localInitLoad() {
		info('[localInitLoad]');
		$.each($('[localStorage]'), function(){
			var $this = $(this);
			if (isOK($this)) {
				var itemKey = getItemKey($this);
				var key 	= getKey($this);
				info('[localLoad]         ' + itemKey + '.' + key);
				$this.val(localLoad(itemKey, key));
				info('[localLoad]         ' + itemKey + '.' + key + ' is loaded');
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
		var et = parseFloat($obj.attr('localStorage').split('@')[1]);

		info('  [getExpireTime]   读取到的过期时间 = ' + et + ' 小时');
		if (isNaN(et)) {
			return undefined;
		}
		return et;
	}

	// 获取key值的方法
	function getKey($obj) {
		return $obj.attr('id') || $obj.attr('name');
	}

	// 本地存储的实现
    function localSave(itemKey, key, value, liveHour) {
    	deleteExpiredItem();
    	
		var item = $.parseJSON(localStorage.getItem(itemKey) || '{}');

		// 更新过期时间
		var d = new Date();
		var liveMillsecond;
		if (liveHour !== undefined) {
			liveMillsecond = liveHour * 3600 * 1000;
		} else {
			liveMillsecond = 7 * 24 * 3600 * 1000;
		}
		var __expire_timestamp__ = d.valueOf() + liveMillsecond;

		var jsonValue = {};
		jsonValue[key] = {'value': value, '__expire_timestamp__': __expire_timestamp__};
		var itemStr = JSON.stringify($.extend(true, {}, item, jsonValue));
		localStorage.setItem(itemKey, itemStr);
    };

    function localLoad(itemKey, key) {
    	deleteExpiredItem();

		var item = $.parseJSON(localStorage.getItem(itemKey) || '{}');
		if (item[key]) {
			return item[key]['value'];
		} else {
			return undefined;
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
    				warn('Not a jsonString, pass');
    			} else {
    				throw e;
    			}
    		}
    		if (jsonData) {
	    		$.each(jsonData, function(key) {
	    			var __expire_timestamp__ = this.__expire_timestamp__;
	    			var now = new Date();
					info('  [deleteExpire...] ' + itemKey + '.' + key + ' 还剩 ' + (__expire_timestamp__ - now.valueOf()) / 1000 + ' 秒');
	    			if (now.valueOf() > __expire_timestamp__) {
						info('  [deleteExpire...] ' + itemKey + '.' + key + ' 已过期，删掉！');
	    				// 过期，删除
	    				delete jsonData[key];
	    			}
	    		});
	    		if ($.isEmptyObject(jsonData)) {
	    			localStorage.removeItem(itemKey);
	    		} else {
	    			var itemStr = JSON.stringify(jsonData);
					localStorage.setItem(itemKey, itemStr);
	    		}
    		}
    	});
    }

}));