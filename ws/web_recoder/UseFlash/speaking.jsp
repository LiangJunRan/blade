<%@ page contentType="text/html;charset=UTF-8"%>
<%@ include file="/WEB-INF/views/include/taglib.jsp"%>
<html>
<head lang="en">
<meta http-equiv="content-type" content="text/html;charset=utf-8">
    <meta name="renderer" content="webkit">
    <meta name="renderer" content="ie-stand">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title></title>
<link rel="stylesheet"
	href="${ctxStatic}/lib/jquery-ui/jquery-ui.min.css" />
<link rel="stylesheet" href="${ctxStatic}/lib/jquery-ui/themes/humanity/theme.css"/>
<link rel="stylesheet"
	href="${ctxStatic}/common/css/font-awesome.min.css">
<link rel="stylesheet" href="${ctxStatic}/common/css/base.css" />
<link rel="stylesheet" href="${ctxStatic}/common/css/icons.css">
<link rel="stylesheet" href="${ctxStatic}/common/css/icons-single.css">
<link rel="stylesheet" href="${ctxStatic}/toefl/common/css/ExciseBase.css">
<link rel="stylesheet" href="${ctxStatic}/toefl/common/css/ReadDir.css">
<link rel="stylesheet" href="${ctxStatic}/toefl/common/css/listen_lecture_listening.css">
<link rel="stylesheet" href="${ctxStatic}/toefl/common/css/commonHead.css">
<link rel="stylesheet" href="${ctxStatic}/toefl/speaking/css/speaking.css">
<link rel="stylesheet" href="${ctxStatic}/toefl/common/css/writingWarnDialog.css">
<!--[if lt IE 9]>
    <script src="${ctxStatic}/lib/es5/es5-shim.js"></script>
    <script src="${ctxStatic}/lib/html5.js"></script>
    <script src="${ctxStatic}/common/js/browser-support-fix.js"></script>
    <![endif]-->
<script src="${ctxStatic}/lib/require.js"></script>
<script src="${ctxStatic}/common/js/require_conf.js"></script>
<script type="text/javascript" src="${ctxStatic}/common/js/dialog.js"></script>
<script src="${ctxStatic}/toefl/js/speaking2.js"></script>
<%-- <script src="${ctxStatic}/toefl/common/js/listen_lecture_listening.js"></script> --%>
<script src="${ctxStatic}/common/js/common.js"></script>
<script type="text/javascript">
	
</script>
<%@ include file="/WEB-INF/views/include/browser_recognition.jsp"%>
</head>
<body>
	<div class="tolPage">
		<div class="header">
			<div class="titleWrap">
				<span class="headerTitle">Speaking</span> <a
					class="exit">Exit</a>
			</div>
			<span class="quesTitle"> <%-- <c:if
					test="${!empty timuIndex}">Question ${timuIndex} of
					6</c:if> --%>
			</span> <input type="hidden" id="timuCount" value="${timuCount}" />
			<div class="button-top">
				<a id="js_next" class="invalid-continue" href="javascript:void(0)">Continue</a>
			</div>
			<div class="volumeBig">
				<a id="volButton"></a>
				<div class="volWrapper">
					<a id="volAdjust" class="noDisplay"></a>
				</div>
			</div>
		</div>
		<span id="save_button"> <span id="flashcontent">
				<p  style="font-size:16px;text-align:center;color:#000;">如果发现不能录音，可能是当前浏览器Flash插件不兼容造成的，请下载并安装指定Chrome浏览器（53版本）。 <a href="/errorBrowserPage"   style="color:red;">点此下载</a><br/>
				当前浏览器：${browser}，版本：${version}
				</p>
		</span>
		</span>
		<div id="speak-content">
			<input type="hidden" id="step" name="step" value="${step}" /> <input
				type="hidden" id="u" name="u" value="${u}" />
			<div class="content content-speak-test">
				<div class="speakContent">
					<div class="mirophone">
						<ul>
							<li class="mirophoneEnTips">Select Microphone</li>
							<li class="mirophoneOption">
								<form action="">
									<select>
										<option>FlashWavRecorder</option>
									</select>
								</form>

							</li>
							<li class="mirophoneChTips">
								<div class="record-volume-bar lightBlue"></div>
								<div class="microphoneTip">您可以测试麦克风了！</div>
							</li>								
							
						</ul>
						
					</div>
					
					<div class="controlButton">
						<ul>
							<li id="recording" class="butBig butInvalid">Recording</li>
							<li id="stop" class="butSmall butInvalid">Stop</li>
							<li id="play" class="butBig butInvalid">Play</li>
							<li id="retry" class="butSmall butInvalid">Retry</li>
							<li id="test" class="butSmall butInvalid" >test</li>
							<li id="saveLocal" class="butSmall butInvalid" >local</li>
						</ul>
					</div>
					
					<p><font color="red">您可以休息10分钟!</font></p>
				</div>
				<span id="no-flashplayer">
				<p  style="font-size:16px;text-align:center;color:#000;">如果发现不能录音，可能是当前浏览器Flash插件不兼容造成的，请下载并安装指定Chrome浏览器（53版本）。 <a href="/errorBrowserPage"   style="color:red;">点此下载</a><br/>
				当前浏览器：${browser}，版本：${version}
				</p>
			</div>
		</div>
	</div>
	<form id="uploadForm" name="uploadForm" action="/exam/voicePost">
		<input name="authenticity_token" value="xxxxx" type="hidden">
		<input name="upload_file[parent_id]" value="1" type="hidden">
		<input name="format" value="json" type="hidden"> 
		<input id="form_u" name="u" value="" type="hidden"> 
		<input id="form_timuId" name="timuId" value="" type="hidden"> 
		<input id="form_step" name="step" value="" type="hidden">
		<input type="hidden" value="${volume}" name="volume" id="volume">
	</form>
	<form id="js_practiseForm" action="reading" method="post"></form>
</body>
</html>