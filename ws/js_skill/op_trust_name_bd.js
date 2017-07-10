var data = "王永,徐镇东,三门峡中海房地产开发有限公司,张永,吴敏,垦利县兴隆街道办事处兴隆村民委员会,方素琴,汪洒洒,张兵,瞿绍明";
var da = data.split(',');

var button = $('.c-btn.c-btn-primary.op_trust_btnSearch');
var idx = -1;

function mySearch() {
	idx += 1;
	if (da[idx] == undefined) {
		return false;
	}
	$('.c-input.op_trust_pername').val(da[idx]);
	button.trigger('click');
	//console.log($('.op_trust_reperson').html());

	setTimeout(mySearch, 1000);
}

mySearch();