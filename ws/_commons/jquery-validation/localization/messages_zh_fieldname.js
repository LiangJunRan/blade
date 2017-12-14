(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["jquery", "jqvalidation-fix"], factory );
	} else {
		factory( jQuery );
	}
}(function( $ ) {

/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: ZH (Chinese, 中文 (Zhōngwén), 汉语, 漢語)
 */

var getFieldName = function(element) {
	var fieldName = $(element).attr("fieldName");
	if(!fieldName) {

		fieldName = $(element).prev("label.control-label").text() ||
		$(element).parent().prev("label.control-label").text() || 
		$(element).parent().parent().prev("label.control-label").text() ||
		$(element).parent().parent().parent().prev("label.control-label").text();
		if(!fieldName) {
			l = $(element).parents(".form-group").find("label.control-label")
			if (l.size() == 1) {
				fieldName = l.text()
			}
		}

		fieldName = fieldName.replace(/[：:]/g, "")
	}
	return fieldName
}

$.validator.gmsg = function(message, format) {
	if(format) {
		var ff = $.validator.format(message);
		return function(parameters, element) {
			return getFieldName(element) + ff(parameters, element)
		}
	} else {
		return function(parameters, element) {
			return getFieldName(element) + message;
		}
	}
}

$.extend($.validator.messages, {
	required    : $.validator.gmsg("必须填写"),
	remote      : $.validator.gmsg("请修正此栏位"),
	email       : $.validator.gmsg("请输入有效的电子邮件"),
	url         : $.validator.gmsg("请输入有效的网址"),
	date        : $.validator.gmsg("请输入有效的日期"),
	dateISO     : $.validator.gmsg("请输入有效的日期 (YYYY-MM-DD)"),
	number      : $.validator.gmsg("请输入正确的数字"),
	digits      : $.validator.gmsg("只可输入数字"),
	creditcard  : $.validator.gmsg("请输入有效的信用卡号码"),
	equalTo     : $.validator.gmsg("你的输入不相同"),
	extension   : $.validator.gmsg("请输入有效的后缀"),
	maxlength   : $.validator.gmsg("最多 {0} 个字", true),
	minlength   : $.validator.gmsg("最少 {0} 个字", true),
	rangelength : $.validator.gmsg("请输入长度为 {0} 至 {1} 之间的字串", true),
	range       : $.validator.gmsg("请输入 {0} 至 {1} 之间的数值", true),
	max         : $.validator.gmsg("请输入不大于 {0} 的数值", true),
	min         : $.validator.gmsg("请输入不小于 {0} 的数值", true)
});

}));