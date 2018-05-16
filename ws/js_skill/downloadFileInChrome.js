$.post("https://voice.kaolawu.com/20171116/1/10/4bca022c10ab4b8ab8a8dd87306ae7ae_8701.mp3", function(data) {
	var b = new Blob([data], {
		type: 'audio/mp3'
	});

	var bURL = URL.createObjectURL(b);

	var link = document.createElement('a');
	link.href = bURL;
	link.setAttribute('download', "DownloadedFilenameHere.mp3");
	document.getElementsByTagName("body")[0].appendChild(link);
	// Firefox
	if (document.createEvent) {
		var event = document.createEvent("MouseEvents");
		event.initEvent("click", true, true);
		link.dispatchEvent(event);
	}
	// IE
	else if (link.click) {
		link.click();
	}
	link.parentNode.removeChild(link);


});