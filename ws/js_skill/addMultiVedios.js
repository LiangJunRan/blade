function addVedio() {

	$.ajax({
		method: 'POST',
		url: '/a/ls/classvideo/save',
		data: {
			id: "",
			classCode: "VTE1026",
			rsVideoId: 4953,
			useType: 1,
			startDate: "2017-11-26",
			effectiveDate: "2018-01-31",
			remarks: "",
			category: 1
		},
		success: function(resp) {
			console.log('resp:', resp);
		},
		error: function(a, b) {
			console.log('[ERROR]', a, b);
		}
	})
}

function addMultiVedios(counts) {
	for(var i = 0; i < counts; i++) {
		addVedio();
	}
}

// 修改参数来设定一次性添加几个视频
addMultiVedios(10);
