function getJSON() {
	var rr;
	$.ajax({
		url: 'http://192.168.10.123:9991/data.json',
		async: false,
		success(r){
			rr = r;
		}
	});
	return rr;
}