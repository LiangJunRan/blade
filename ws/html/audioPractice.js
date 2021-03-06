// http://voice.kaolawu.com/20171217/0/6/c881bdca393048a783e0815ae22f4b92_928.mp3?sp=2017-12-17 05:18:04


window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;

try {
    var audioContext = new window.AudioContext();
} catch (e) {
    Console.log('[CRITICAL] Your browser does not support AudioContext');
}

// 定义加载音频文件的函数
function loadSound(url) {
    var request = new XMLHttpRequest();		//建立一个请求
    request.open('GET', url, true);			//配置好请求类型，文件路径等
    request.responseType = 'arraybuffer';	//配置数据返回类型

    // 一旦获取完成，对音频进行进一步操作，比如解码
    request.onload = function() {
        var arrayBuffer = request.response;

        // 将文件编码解码成audioBuffer
        audioContext.decodeAudioData(arrayBuffer, function(buffer) {
        	console.log('[OK] 解码成功');

	        var audioBufferSouceNode = audioContext.createBufferSource();
			audioBufferSouceNode.buffer = buffer;

			var audioBufferSouceNode = audioContext.createBufferSource();
		    audioBufferSouceNode.connect(audioContext.destination);
		    audioBufferSouceNode.buffer = buffer;
		    audioBufferSouceNode.start(0);

	        // 分析器部分
	        var analyser = audioContext.creatAnalyser();

        }, function(e) {
        	console.log('[ERROR] 解码失败！');
        });

    }
    request.send();
}


loadSound("http://voice.kaolawu.com/20171217/0/6/c881bdca393048a783e0815ae22f4b92_928.mp3?sp=2017-12-17 05:18:04"); //调用

// loadSound("http://192.168.10.123:9999/data/556_Butterfly%20Kiss.mp3");