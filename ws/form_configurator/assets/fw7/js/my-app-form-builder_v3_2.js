var device = Framework7.prototype.device;

var project = 'blade';

var url_studentList;
var url_getformvaluebyid;
var url_getbyid;
var url_saveformData;

if (project == 'bpmApp') {
	// bpmApp用
	url_studentList = "/bpmapp/form/studentList";
	url_getformvaluebyid = "/bpmapp/form/getformvaluebyid";
	url_getbyid = "/bpmapp/form/getbyid";
	url_saveformData = "/bpmapp/form/saveformData";
} else if (project == 'blade') {
	// blade用
	url_studentList = "data/studentList.json";
	url_getformvaluebyid = "data/getformvaluebyid.json";
	url_getbyid = "data/getbyid_2.json";
	url_saveformData = "data/saveformData.json";
}

// Initialize your app
var myApp = new Framework7({
	init: false  // 关闭自动初始化
});

// Export selectors engine
var $$ = Dom7;
var $ = $$;

//change skin
if (device.android) {
	console.log('This is android');
	$$('.ios-css').remove();
} else {
	console.log('This is NOT android');
	$$('.android-css').remove();
}

// Add view
var mainView = myApp.addView('.view-main', {
	// Because we use fixed-through navbar we can enable dynamic navbar
	dynamicNavbar: true,
	domCache: true,	  //enable inline pages
	// swipePanel: 'left',
	animatePages: false
});

// 给安卓机械后退按键使用的方法
function androidBackBtn() {
	// 给相册加安卓返回键绑定
	if ($('.photo-browser').length > 0) {
		$('.photo-browser').find('.photo-browser-close-link').click();
	} else {
		mainView.history.pop();
		var backUrl = mainView.history.pop();
		if (backUrl) {
			backUrl = backUrl.substring(1);
			mainView.router.load({pageName: backUrl});
		} else {
			window.location = '/exit-web-view';
		}
	}
}

var serviceType = $$('#serviceType').val();
var formInsideId = $$('#formInsideId').val();
var groupId = $$('#groupId').val();
var workflowNumber = $$('#workflowNumber').val();
var hasValue = ($$('#hasValue').val() == 'true');

var isRead = false;

var getQueryString = function (name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}

var isShared = !!getQueryString('isShared');

// 页面数据
var pageTitles = [
	{
		url: 'testForm',
		label: '班级信息'
	}];

myApp.showPreloader('加载学生列表中...');
var loadStudentListError = false;
$$.ajax({
	url: url_studentList,
	data: {'workflowNumber': workflowNumber},

	async: false,
	dataType: 'json',
	success: function(data) {
		pageTitles.add(data);
	},
	error: function(result) {
		loadStudentListError = true;
		console.error('[ERROR] 加载学生列表失败！');
	},
	complete: function() {
		myApp.hidePreloader();
		if (loadStudentListError) {
			myApp.alert('加载学生列表失败。请稍后重试', '提示');
		}
	}
});

myApp.showPreloader('加载班级信息中...');
var loadClassInfoError = false;
var jsonConf_index = "";
// 加载已填写过的首页数据
if (hasValue) {
	$$.ajax({
		url: url_getformvaluebyid,
		data: {
			'serviceType': serviceType,
			'formInsideId': formInsideId,
			'workflowNumber': workflowNumber,
			'formName': 'testForm'
		},
		dataType: 'json',
		async: false,
		success: function(data) {
			jsonConf_index = strToJson(data);
		},
		error: function(result) {
			console.error('[ERROR] 加载班级表单数据失败！');
		},
		complete: function() {
			myApp.hidePreloader();
			if (loadClassInfoError) {
				myApp.alert('加载班级表单数据失败。请稍后重试', '提示');
			}
		}
	});
}
// 新建时首页的数据
else {
	$$.ajax({
		url: url_getbyid,
		data: {
			'serviceType': serviceType,
			'formInsideId': formInsideId
		},
		dataType: 'json',
		async: false,
		success: function(data) {
			jsonConf_index = strToJson(data);
		},
		error: function(result) {
			console.error('[ERROR] 加载班级表单配置失败！');
		},
		complete: function() {
			myApp.hidePreloader();
			if (loadClassInfoError) {
				myApp.alert('加载班级表单配置失败。请稍后重试', '提示');
			}
		}
	});
}

//定义首页初始化前执行代码
myApp.onPageBeforeInit('testForm', function (page) {
	if (loadStudentListError || loadClassInfoError) {
		$$('form#testForm>div.content-block-title').html('加载失败');
	} else {
		$$('form#testForm>div.content-block-title').remove();
	}
	
	if (project == 'bpmApp') {
		// bpmApp用
		$$('form#testForm').renderForm(jsonConf_index);
	} else if (project == 'blade') {
		// blade用
		$$('form#testForm').renderForm(jsonConf_index['testForm']);
	}

	if(formInsideId == '26') {
		$$('form#testForm').find('[name=comments]').on('change', function(){
			if ($$(this).val()) {
				$$('#groupId').val($$(this).val());

				// 重新渲染后边的page
				initStudentsFormsAndPages();
			} else {
				myApp.hidePreloader();
			}
		});
		if (!jsonConf_index.isRead) {
			$$('form#testForm').find('[name=comments]').trigger('change');
		}
	}
	if (jsonConf_index.isRead) {
		isRead = true;
		// 隐藏上传按钮
		$$('.save-bar').hide();
		// 显示分享按钮
		$$('.share-btn').show();
		$$('#groupId').val(jsonConf_index.values['comments']);
		// 重新渲染后边的page
		initStudentsFormsAndPages();
	}
	if (isShared) {
		// 隐藏分享按钮
		$$('.share-btn').hide();
		// 隐藏退出按钮
		$$('.exit-web-view').hide();
	}
	// 显示翻页按钮
	$$('.page-prev, .page-next').show();
});

// 手动触发初始化（否则smart-select显示有问题)
myApp.init();

$$('.view.view-main').off('touchstart');

// 配置
var pageTemplate = 
	'<div class="page">' +
		'<div class="page-content">' +
			'<form id="{formId}">' +
			'</form>' +
		'</div>' +
	'</div>';

function strToJson(str){
	if (project == 'bpmApp') {
		// bpmApp用
		var json = eval('(' + str + ')');
		return json;
	} else if (project == 'blade') {
		// blade用
		return str;
	}
}

// 初始化导航栏
$$.each(pageTitles, function(idx) {
	var pt = pageTitles[idx];

	// 导航菜单初始化
	$$('.navList').append('<li class="item-content"><a class="item-inner close-panel" href="#' + pt.url + '__">' + pt.label + '</a></li>');
});

// 导航菜单加校验
$$('.navList a').on('click', function(){
	var href = $$(this).attr('href');
	if (!validateForm(pageTitles[nowPageIndex].url)) {
		return false;
	} else {
		mainView.router.load({pageName: href.substring(1,href.length - 2)});
	}
});

// 当前页面的页码
var nowPageIndex = 0;

// 初始化学生表单和页面
function initStudentsFormsAndPages(){
	if ($$('.modal-overlay').length != 0) {
		myApp.hidePreloader();
	}
	 myApp.showPreloader('加载学生表单中...');
	// 表单数据
	var jsonConfs = undefined;
	var groupId = $$('#groupId').val();

	// 编辑和只读模板数据
	if (hasValue) {
		jsonConfs = {};
		var completeCounts = 0;
		var loadError = [];
		for (var i = 0; i < pageTitles.length; i++) {
			(function(_i) {
				$$.ajax({
					url: url_getformvaluebyid,
					data: {
						'serviceType': serviceType,
						'formInsideId': groupId,
						'workflowNumber': workflowNumber,
						'formName': pageTitles[_i].url
					},
					dataType: 'json',
					success: function (data) {
						jsonConfs[pageTitles[_i].url] = strToJson(data);
						reRenderPage(_i, jsonConfs[pageTitles[_i].url]);
					},
					error: function (result) {
						loadError.push(pageTitles[_i].label);
						console.error('[ERROR] 加载学生表单数据失败！表单名：' + pageTitles[_i].label);
					},
					complete: function(xhr, status) {
						completeCounts += 1;
						if (completeCounts == pageTitles.length - 1) {
							myApp.hidePreloader();
							if (loadError.length != 0) {
								myApp.alert('加载[' + loadError.join(', ') + ']表数据失败。请稍后重试', '提示');
							}
						}
					}
				});
			})(i);
		}
	}
	// 新建时的模板数据
	else {
		var foundError = false;
		$$.ajax({
			url: url_getbyid,
			data: {
				'serviceType': serviceType,
				'formInsideId': groupId
			},
			dataType: 'json',
			async: false,
			success: function(data) {
				jsonConfs = strToJson(data);
				// 初始化页面和导航
				$$.each(pageTitles, function(idx){
					if (project == 'bpmApp') {
						// bpmApp用
						reRenderPage(idx, jsonConfs);
					} else if (project == 'blade') {
						// blade用
						reRenderPage(idx, jsonConfs['student_1']);
					}
				});
			},
			error: function(result) {
				foundError = true;
				console.error('[ERROR] 加载学生表单配置失败！');
			},
			complete: function() {
				myApp.hidePreloader();
				if (foundError) {
					myApp.alert('加载学生表单失败。请稍后重试', '提示');
				}
			}
		});
	}
}
if(formInsideId != '26') {
	initStudentsFormsAndPages();
}

// 重新渲染指定page的方法
function reRenderPage(idx, jsonConf) {
	var pt = pageTitles[idx];
	// 除首页外
	if (idx != 0) {
		// 干掉已经渲染过得page
		$$('[data-page=' + pt.url + ']').remove();

		// page初始化
		var $page = $$(pageTemplate.format({formId: pt.url})).attr('data-page', pt.url)
			.attr('page-index', idx).addClass('cached');

		$$('.pagesContainer').append($page);

		// 渲染form主体
		$page.find('form').renderForm(jsonConf);

		// 加form的标题
		$page.find('form').prepend('<div class="content-block-title">' + pt.label + '</div>');
	}

	// 翻页后事件回调绑定
	myApp.onPageAfterAnimation(pt.url, function(pageData) {
		// 更新当前页码
		nowPageIndex = parseInt($$(pageData.container).attr('page-index'));
		// 临时解决multiselect的placeholder初始化问题
		$$(pageData.container).find('select[multiple]').change();
		
		// 显示翻页按钮
		$$('.page-prev, .page-next').show();
	});
}

function getFormData(formId) {
	if($$('form#' + formId).length == 1) {
		var formData = myApp.formToData('#' + formId);
		var allDisabled = $$('#' + formId).find(':disabled');

		// 手动删掉禁用的项
		$$.each(allDisabled, function(idx) {
			var disabledName = allDisabled[idx].name;
			if (disabledName in formData) {
				delete formData[disabledName];
			}
		});

		return formData;
	} else {
		return undefined;
	}
}

// 提交方法、暂存方法
$$('.all-form-submit, .all-form-save').on('click', function () {
	var submitMode = $$(event.target).hasClass('all-form-submit');
	var formDatas = {};
	$$.each(pageTitles, function(idx){
		var formId = pageTitles[idx].url;

		var formData = getFormData(formId);
		if(formData !== undefined) {
			formDatas[formId] = formData;
		}
	});

	if (submitMode) {
		// 校验本页
		if (!validateForm(pageTitles[nowPageIndex].url)) {
			return false;
		}
		var needCheckLabels = [];
		var needCheckFormNames = [];
		$$.each(pageTitles, function(idx){
			// 检查form是否存在
			if ($$('form#' + pageTitles[idx].url).length == 0) {
				needCheckFormNames.push(pageTitles[idx].label);
			}
			// 校验form必填项是否填写
			if (!validateForm(pageTitles[idx].url, true)) {
				needCheckLabels.push(pageTitles[idx].label);
			}
		});
		if (needCheckFormNames.length > 0) {
			myApp.alert('未找到表单：' + needCheckFormNames.join(', ') + '！！请联系开发人员！！', '致命错误');
			return false;
		}
		if (needCheckLabels.length > 0) {
			myApp.alert('请检查表单：' + needCheckLabels.join(', ') + '。输入必填项', '提示');
			return false;
		}
		myApp.showPreloader('上传中...');
		
		// 提交（对应已办）
		$$.ajax({
			url: url_saveformData,
			type: 'post',
			dataType: 'json',
			data: 'formValue=' + encodeURI(JSON.stringify(formDatas)) + '&workflowNumber=' + workflowNumber + '&isSubmit=1',
			success: function(result){
				myApp.alert('提交成功', '提示', function() {
					// 点击OK后的操作
					window.location = '/submit-success';
				});
				$$('.popup-submit .group-ready').hide();
				$$('.popup-submit .group-done').show();
			},
			error: function(result) {
				myApp.alert('提交失败', '提示');
			},
			complete: function() {
				setTimeout(function () {
					myApp.hidePreloader();
				}, 5000);
			}
		});
	} else {
		myApp.showPreloader('上传中...');
		// 仅保存（对应待办）
		$$.ajax({
			url: url_saveformData,
			type: 'post',
			dataType: 'json',
			data: 'formValue=' + encodeURI(JSON.stringify(formDatas)) + '&workflowNumber=' +workflowNumber + '&isSubmit=0',
			success: function(result){
				myApp.alert('暂存成功', '提示');
			},
			error: function(result) {
				myApp.alert('暂存失败', '提示');
			},
			complete: function() {
				setTimeout(function () {
					myApp.hidePreloader();
				}, 5000);
			}
		});
	}
});

// 校验方法
function validateForm(formId, skipAlert) {
	skipAlert = skipAlert || false;
	var foundMissing = false;
	// 提示必填项、校验
	var $form = $$('form#' + formId);
	if ($form.length == 1) {
		var formId = $form.attr('id');
		// 当前form数据
		var formData = getFormData(formId);
		// 当前form所有必填name（去重用）
		var allRequiredNames = [];
		var allRequiredNode = $form.find('[required]:enabled');
		$$.each(allRequiredNode, function(idx){
			var requiredName = allRequiredNode[idx].name;
			if (allRequiredNames.indexOf(requiredName) == -1) {
				allRequiredNames.push(requiredName);
				// 发现图片特征，特殊处理
				/*if ((requiredName in formData) && formData[requiredName] !== undefined && typeof(formData[requiredName]) == 'string' && formData[requiredName].match(/images:\[(.*)\]/)) {
					var urlString = formData[requiredName].match(/images:\[(.*)\]/)[1];
					if (urlString.length == 0) {
						foundMissing = true;
						var studentMissingLabel = $form.find('[name=' + requiredName + ']').closest('.listNode').children().data('opts').label;
						var formTitle = pageTitles[nowPageIndex].label;
						if (!skipAlert) {
						myApp.alert('请输入：' + formTitle + '/' + studentMissingLabel, '提示');
						}
					}
				}*/
				// 请求数据没在formdata中有 或者 formdata中对应数据是空的
				/*else */if (!((requiredName in formData) && formData[requiredName] !== undefined && formData[requiredName].length != 0)) {
					foundMissing = true;
					var studentMissingLabel = $form.find('[name=' + requiredName + ']').closest('.listNode').children().data('opts').label;
					var formTitle = pageTitles[nowPageIndex].label;
					if (!skipAlert) {
						myApp.alert('请输入：' /*+ formTitle + '/'*/ + studentMissingLabel, '提示');
					}
				}
			}
		});
	}

	if (foundMissing) {
		return false;
	} else {
		return true;
	}
}

// 翻页方法
function bindPagerBtn() {
	$$('.page-prev').on('click', function () {
		$$('.page-prev').hide();
		var prevIndex = nowPageIndex - 1;
		if (prevIndex < 0) {
			// prevIndex = pageTitles.length - 1;
			$$('.page-prev').show();
			myApp.alert('到达首页', '提示');
		} else {
			mainView.router.load({pageName: pageTitles[prevIndex].url});
		}
		return false;
	});
	$$('.page-next').on('click', function () {
		$$('.page-next').hide();
		if (!validateForm(pageTitles[nowPageIndex].url)) {
			$$('.page-next').show();
			return false;
		}

		var nextIndex = nowPageIndex + 1;
		if (nextIndex >= pageTitles.length) {
			$$('.page-next').show();
			if (isRead) {
				myApp.alert('到达末页', '提示');
			} else {
				myApp.popup('.popup-submit');
			}
		} else {
			mainView.router.load({pageName: pageTitles[nextIndex].url});
		}
		return false;
	});
	$$('.save-bar').on('click', function () {
		myApp.popup('.popup-submit');
		return false;
	});  
}
bindPagerBtn();

// 扩展array类型原生方法，添加obj如果是array，就让其元素合并，否则直接加入
Array.prototype.add = function(obj) {
	var arrList = this;
	if ($.isArray(obj)) {
		$.each(obj, function(_idx) {
			arrList.push(obj[_idx]);
		});
	} else {
		arrList.push(obj);
	}
}

function GetQueryString(name) {
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return r[2]; return null;
}

// 退出webView的方法
$$('.exit-web-view').on('click', function(){
	window.location = '/exit-web-view';
});

// 微信分享方法
$$('.share-btn').on('click', function(){
	var data = {
		link: location.pathname + location.search + '&isShared=1',
		teacherName: $$('.teacherName').html(),
		lessonNo: $$('.lessonNo').html(),
		lessonTitle: $$('.lessonTitle').html()
	};
	var urlParam = $$.param(data);
	var url = "/share-url?" + urlParam;
	
	window.location = url;
});

// 预上传回调
function preUploadCallback(data) {
	$$('form#{formId} [name={name}]'.format(data)).closest('.item-content').data('preUpload')(data);
}

// 上传完毕回调
function uploadedCallback(data) {
	$$('form#{formId} [name={name}]'.format(data)).closest('.item-content').data('uploaded')(data);
}

var myPhotoBrowser = undefined;

// 查看已上传图片的方法
$$('body').on('click', '.openPhotoBrowser', function(e) {
	var nowUrl = e.target.getAttribute('src');
	var urlList = $$(e.target).closest('.item-content').find('input').val().match(/images:\[(.*)\]/)[1].split(',');
	var nowIndex = urlList.indexOf(nowUrl);

	myPhotoBrowser = myApp.photoBrowser({
		photos: urlList,
		onOpen: function(photobrowser) {
			console.log('opened', photobrowser);
			$$('.photo-browser').find('i.icon').addClass('color-white').addClass('icon-white');
		}
	});

	// 加载失败的图片不响应打开相册操作
	if (nowIndex != -1) {
		myPhotoBrowser.open(nowIndex); // open photo browser
	}
});

// TODEL
/*setTimeout(function() {
	preUploadCallback({formId: 'student_1', name: 'rec', groupId:  0, count: 1});
}, 4000);

setTimeout(function() {
	uploadedCallback({formId: 'student_1', name: 'rec', groupId:  0, index: 0, url: "http://192.168.10.123:9999/data/556_Butterfly%20Kiss.mp3"});
}, 7000);*/
