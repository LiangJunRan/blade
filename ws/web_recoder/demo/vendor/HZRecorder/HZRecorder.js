﻿(function (window) {
    //兼容
    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    var HZRecorder = function (stream, config) {
        var context = new (window.webkitAudioContext || window.AudioContext);

        config = config || {};
        config.sampleBits = config.sampleBits || 8;      //采样数位 8, 16
        config.sampleRate = config.sampleRate || (context.sampleRate/6);   //在chrome和火狐浏览器下值不是44100,所以不能用44100/6  
        var audioInput = context.createMediaStreamSource(stream);
        var createScript = context.createScriptProcessor || context.createJavaScriptNode;
        var recorder = createScript.apply(context, [4096, 1, 1]);

        var audioData = {
            size: 0          //录音文件长度
            , buffer: []     //录音缓存
            , inputSampleRate: context.sampleRate    //输入采样率
            , inputSampleBits: 8       //输入采样数位 8, 16
            , outputSampleRate: config.sampleRate    //输出采样率
            , oututSampleBits: config.sampleBits       //输出采样数位 8, 16
            , input: function (data) {
                this.buffer.push(new Float32Array(data));
                this.size += data.length;
            }
            , compress: function () { //合并压缩
                //合并
                var data = new Float32Array(this.size);
                var offset = 0;
                for (var i = 0; i < this.buffer.length; i++) {
                    data.set(this.buffer[i], offset);
                    offset += this.buffer[i].length;
                }
                //压缩
                var compression = parseInt(this.inputSampleRate / this.outputSampleRate);
                var length = data.length / compression;
                var result = new Float32Array(length);
                var index = 0, j = 0;
                while (index < length) {
                    result[index] = data[j];
                    j += compression;
                    index++;
                }
                return result;
            }
            , encodeWAV: function () {
                var sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);
                var sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
                var bytes = this.compress();
                var dataLength = bytes.length * (sampleBits / 8);
                var buffer = new ArrayBuffer(44 + dataLength);
                var data = new DataView(buffer);

                var channelCount = 1;//单声道
                var offset = 0;

                var writeString = function (str) {
                    for (var i = 0; i < str.length; i++) {
                        data.setUint8(offset + i, str.charCodeAt(i));
                    }
                }

                // 资源交换文件标识符 
                writeString('RIFF'); offset += 4;
                // 下个地址开始到文件尾总字节数,即文件大小-8 
                data.setUint32(offset, 36 + dataLength, true); offset += 4;
                // WAV文件标志
                writeString('WAVE'); offset += 4;
                // 波形格式标志 
                writeString('fmt '); offset += 4;
                // 过滤字节,一般为 0x10 = 16 
                data.setUint32(offset, 16, true); offset += 4;
                // 格式类别 (PCM形式采样数据) 
                data.setUint16(offset, 1, true); offset += 2;
                // 通道数 
                data.setUint16(offset, channelCount, true); offset += 2;
                // 采样率,每秒样本数,表示每个通道的播放速度 
                data.setUint32(offset, sampleRate, true); offset += 4;
                // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8 
                data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true); offset += 4;
                // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8 
                data.setUint16(offset, channelCount * (sampleBits / 8), true); offset += 2;
                // 每样本数据位数 
                data.setUint16(offset, sampleBits, true); offset += 2;
                // 数据标识符 
                writeString('data'); offset += 4;
                // 采样数据总数,即数据总大小-44 
                data.setUint32(offset, dataLength, true); offset += 4;
                // 写入采样数据 
                if (sampleBits === 8) {
                    for (var i = 0; i < bytes.length; i++, offset++) {
                        var s = Math.max(-1, Math.min(1, bytes[i]));
                        var val = s < 0 ? s * 0x8000 : s * 0x7FFF;
                        val = parseInt(255 / (65535 / (val + 32768)));
                        data.setInt8(offset, val, true);
                    }
                } else {
                    for (var i = 0; i < bytes.length; i++, offset += 2) {
                        var s = Math.max(-1, Math.min(1, bytes[i]));
                        data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                    }
                }
                return new Blob([data], { type: 'audio/wav' });
            }
            ,closeContext:function(){
            	context.close();
            }
        };

        //开始录音
        this.start = function () {
            audioInput.connect(recorder);
            recorder.connect(context.destination);
        }

        //停止
        this.stop = function () {
            recorder.disconnect();
        }

        //获取音频文件
        this.getBlob = function () {
            this.stop();
            return audioData.encodeWAV();
        }

        //回放
        this.play = function (audio) {
			var b=this.getBlob();
			//console.log(b)
            audio.src = window.URL.createObjectURL(b);
        }
        
        //停止播放
        this.stopPlay=function(audio){
        	audio.pause();
        }
        
        this.close=function(){
            audioData.closeContext();
        }

        //上传
        this.upload = function (url,pdata, callback) {
        	var fd = new FormData();  
            fd.append('file', this.getBlob());  
            var xhr = new XMLHttpRequest();
            for (var e in pdata)
                    fd.append(e, pdata[e]);  
            if (callback) {  
                xhr.upload.addEventListener('progress', function (e) {  
                    callback('uploading', e);  
                }, false);  
                xhr.addEventListener('load', function (e) {  
                    callback('ok', e);  
                }, false);  
                xhr.addEventListener('error', function (e) {  
                    callback('error', e);  
                }, false);  
                xhr.addEventListener('abort', function (e) {  
                    callback('cancel', e);  
                }, false);  
            }  
            xhr.open('POST', url);  
            xhr.send(fd);  
        }

        //音频采集
        var $tips=$(".mirophoneChTips");
        var $bar=$(".record-volume-bar");
        var $tipExam=$(".speakVolume");
        recorder.onaudioprocess = function (e) {
            audioData.input(e.inputBuffer.getChannelData(0));
        	//音波
            if($tips.length>0){  //练习音波
                var width=$tips.width();
	            var input = e.inputBuffer.getChannelData(0);
                var changeWidth=width/2*Math.max.apply(null,input);
                $bar.width(changeWidth*1.3);
        	}
            else if($tipExam.length>0){  //课堂音波
                var width=$tipExam.width();
	            var input = e.inputBuffer.getChannelData(0);
                var changeWidth=width/2*Math.max.apply(null,input);
                $bar.width(changeWidth*1.3);
        	}
        	//考试录音进度
            if($("#responseTime").length>0){
	            var currentTime=parseInt(e.playbackTime);   //当前录音时长
	            var maxValue=$("#responseTime").val();   //录音总时长
	            var doneTime=$("#hidDoen").val();   //赋值录制完成
	            if(e.playbackTime > parseInt(maxValue)+0.4){
	            	currentTime = maxValue;
	            	recorder.disconnect();   //停止录音
	            	$("#hidDoen").val(true);
	            }
	            var overTime=maxValue-currentTime;   //当前剩余时长
	            timeChange(overTime, 'record-time');   //修改剩余时间显示
	            /*动态滚动条*/
	            dragMove('speak-percent-bar',currentTime, maxValue);
            }
        }
        /*录音剩余时间*/
        function timeChange(time,timePlaceId,ishour){   //time:时长，timePlaceId：时间显示控件，ishour：bool值，是否显示小时，默认不显示
            var timePlace1 = document.getElementById(timePlaceId),totalTime;
            //小时
            if(timePlace1 !== undefined && timePlace1 !== null){
                var hour = time / 3600;
                var hours = parseInt(hour);
                if(hours < 10){
                    hours = "0" + hours;
                }
                //分钟
                var minute = time / 60;
                var minutes = parseInt(minute);
                if(minutes < 10){
                    minutes = "0" + minutes;
                }
                //秒
                var second = time % 60;
                var seconds = Math.round(second);
                if(seconds < 10 ){
                    seconds = "0" + seconds;
                }
                if(ishour === undefined || ishour === false){
                    totalTime = minutes  + ":"  +seconds ;
                }
                else{

                    totalTime =hours+":"+minutes  + ":" + seconds;
                }

                if(timePlaceId !== undefined){
                    $(timePlace1).html(totalTime);
                }
                
                return totalTime;
            }
        }
        /*滚动条滑动*/
        function dragMove(progressBarId,value, max,drag) {
            var progressBar1 = document.getElementById(progressBarId);
            var dragBar = $(drag);
            if(max === undefined){
                max = 100;
            }
            if(progressBar1 !== null){
                progressBar1.style.width = (max !== 0 ? (value / max) : 0) * 100 + "%";
                dragBar.css('left',(max !== 0 ? (value / max) : 0) * 100 + "%");
            }
        }
    };
    //抛出异常
    HZRecorder.throwError = function (message) {
	    $("#recording").addClass("butInvalid");
        var dialog = new Dialog({ok: '确定', title: '录音提醒', message: message});
        dialog.show();
        //throw new function () { this.toString = function () { return message; } }
    }
    //是否支持录音
    HZRecorder.canRecording = (navigator.getUserMedia != null);
    //获取录音机
    HZRecorder.get = function (callback, config) {
        //if (callback) {
    	var throwError='';
            if (navigator.getUserMedia) {
                navigator.getUserMedia(
                    { audio: true } //只启用音频
                    , function (stream) {
                    	if(callback){
	                        var rec = new HZRecorder(stream, config);
	                        callback(rec);
                    	}
                    }
                    , function (error) {
                        switch (error.code || error.name) {
                            case 'PERMISSION_DENIED':
                            case 'PermissionDeniedError':
                            case 'NotAllowedError':
                            	HZRecorder.throwError('请允许该网站使用您的麦克风，启用后刷新浏览器！');
                            	break;
                            case 'NOT_SUPPORTED_ERROR':
                            case 'NotSupportedError':
                            	HZRecorder.throwError('浏览器不支持硬件设备。');
                            	break;
                            case 'MANDATORY_UNSATISFIED_ERROR':
                            case 'MandatoryUnsatisfiedError':
                            	HZRecorder.throwError('无法发现指定的硬件设备。');
                            	break;
                            default:
                            	//HZRecorder.throwError('无法打开麦克风。异常信息:' + (error.code || error.name));
                            	HZRecorder.throwError('找不到麦克风，请检查设备是否可用！修复后刷新浏览器！');
                            	break;
                        }
                    });
				} else {
				    HZRecorder.throwErr('当前浏览器不支持录音功能。'); return;
				}
            return throwError;
		//}
    }

window.HZRecorder = HZRecorder;

})(window);