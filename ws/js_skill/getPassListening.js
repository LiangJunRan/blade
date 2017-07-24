function getPassListening() {
	$('audio').trigger('ended');
	$('[for=answerA]').click().trigger('change').trigger('mouseup');
	$('[for=answerB]').click().trigger('change').trigger('mouseup');
	$('#js_listen_next').click();
	$('#js_next').click();
}
getPassListening();
