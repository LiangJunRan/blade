/**
 * @author: kuroikenshi@sina.com
 * @version: 1.1.1
 * @info: 加载本js后，页面你支持input type="money"方法，已解决ie8兼容性问题。
 *
 */
function addInputTypeMoney(){
	// 整数字符串检测和裁剪
	function cutInt(strInt, mx){
		var str = parseInt(strInt).toString();
		if (str.length > mx){
			str = str.substring(0, mx);
		}
		return str;
	}
	function formatter(o, mx, blur) {
		o.value = o.value.replace(/[^\d\.]/g, '');//删除非数字的内容，防止乱输入非数字内容
		var str = o.value;
		// 如果为空，退出以免报错
		if (!(str)){
			return;
		}

		// 开头输入.自动在前面补0
		if (str[0] == ".") {
			str = '0' + str;
		}


		// 判断有没有小数点
		if (Math.abs(str.length - str.replace(/\./g, '').length) > 0 ){
			// 有小数点
			// 判断是1个还是大于1个
			var dotCount = Math.abs(str.length - str.replace(/\./g, '').length);
			// 如果小数点个数大于1个，只保留第二个小数点前的字符串
			if (dotCount > 1) {
				str = (str.split('.'))[0] + '.' + (str.split('.'))[1];
			}
			// 整数字符串长度检测和裁剪
			var strInt = cutInt(str, mx);
			var strFlt = (str.split('.'))[1];
			if (strFlt.length > 2) {
				strFlt = strFlt.substring(0, 2);
			}
			// 重新拼装字符串
			str = strInt + '.' + strFlt;
		} else {
			// 输入数为整数
			// 做整数长度检测和裁剪
			str = cutInt(str, mx);
		}

		o.value = str;

		if (blur){
			if ((str.split('.'))[1]){	// 有小数点，且有小数
				var strInt = (str.split('.'))[0];
				var strFloatOnly = (str.split('.'))[1];
	        	o.value = strInt.replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,'$1,') + "." + strFloatOnly;
			} else {
				o.value = parseInt(str).toString().replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,'$1,');
			}
		}
    }

	function changeTagValue(st){
		var standFor = st.attr('standfor')
		var value = st.val().replace(/[^\d.]/g, '');
		if (standFor[0] == "#"){
			$(standFor).val(value);
		} else {
			$('[name="' + standFor + '"]').val(value);
		}
	};

	function changeDom(t, dynamic){
		var tag = $(t);
		var mx = tag.attr('max-int') || 15;
		var tagStand = $(
			'<input type="text" standfor=""/>'
		);

		tagStand.prop('class', tag.prop('class'));
		tagStand.prop('readonly', tag.prop('readonly'));
		tagStand.prop('disabled', tag.prop('disabled'));
		if (!tag.prop("readonly") && !tag.prop("disabled")) {
			tagStand.on('focus input', function() {
				formatter(this, mx);
			});
			tagStand.on('keyup', function() {
				formatter(this, mx);
				changeTagValue($(this));
			});
		}
		tagStand.on('change', function(){
			changeTagValue($(this));
		});

		tagStand.on('blur', function(){
			formatter(this, mx, true);
			changeTagValue($(this));
		});

		tag.on('blur focusout', function(){
			tagStand.val(tag.val()).trigger("blur");
		});

		tag.css('display', 'none');
		var standFor = tag.attr('id') ? "#" + tag.attr('id') : tag.attr('name');
		tagStand.attr('standfor', standFor);
		tagStand.val(tag.val()).trigger("blur");

		tag.before(tagStand);

		// 如果是动态加上的输入框，需要改变下焦点
		if (dynamic){
			setTimeout(function(){
				tagStand.focus();
			}, 0);
		}
	}

	// 初始化type=money，绑定事件
	function init(arrTag){
		$.each(arrTag, function(){
			changeDom(this);
		});
	}

	// 初始化时将已有type=money隐藏，并绑定事件，
	// 这样后边onFocus时不可能会出现已经处理过的input
	// 所以后边不需要判断是否已经处理过
	var arrTag = $('input[type="money"]');
	init(arrTag);

	$('body').delegate('input[type="money"]', 'focus', function(){
		changeDom(this, true);
	})

};

$(function(){
	addInputTypeMoney();
});
