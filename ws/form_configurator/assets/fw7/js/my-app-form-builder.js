// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;
var $ = $$;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
    domCache: true,         //enable inline pages
    swipePanel: 'left',
    animatePages: false
});

// 配置
var pageTemplate = 
    '<div class="page">' +
        '<div class="page-content">' +
            '<form id="{formId}">' +
            '</form>' +
        '</div>' +
    '</div>';

// 页面数据
var pageTitles = [
    {
        url: 'index',
        label: '班级信息'
    }, {
        url: 'student-1',
        label: '学生 - 1'
    }, {
        url: 'student-2',
        label: '学生 - 2'
    }];
// 当前页面的页码
var nowPageIndex = 0;

// 初始化页面和导航
$$.each(pageTitles, function(idx){
    var pt = pageTitles[idx];

    // 导航菜单初始化
    $$('.navList').append('<p><a class="close-panel" href="#' + pt.url + '">' + pt.label + '</a></p>');

    // page初始化
    var $page = $$(pageTemplate.format({formId: pt.url})).attr('data-page', pt.url)
            .attr('page-index', idx).addClass('cached');

    // TODO: 初始化页面详细过程
    if (idx != 0) {
        $$('.pages').append($page);

        $page.find('form').renderForm({
            "items": [{
                "name": "t1",
                "label": "文本框",
                "outerWidth": 12,
                "labelWidth": 3,
                "contentWidth": 9,
                "widthInSteam": "auto",
                "type": "text",
                "placeholder": "请输入文本",
                "description": "请输入英文、数字、下划线"
            },
            {
                "name": "s1",
                "label": "下拉单选",
                "outerWidth": 12,
                "labelWidth": 3,
                "contentWidth": 9,
                "widthInSteam": "auto",
                "type": "select",
                "placeholder": "请点击选择",
                "description": "请点击选择",
                "dataUrl": "",
                "options": [{
                    "label": "选项1",
                    "value": 1
                },
                {
                    "label": "选项2",
                    "value": 2
                },
                {
                    "label": "选项3",
                    "value": 3
                }]
            },
            {
                "name": "s2",
                "label": "下拉多选",
                "outerWidth": 12,
                "labelWidth": 3,
                "contentWidth": 9,
                "widthInSteam": "auto",
                "type": "multiselect",
                "placeholder": "请点击选择",
                "description": "请点击选择",
                "dataUrl": "",
                "options": [{
                    "label": "选项1",
                    "value": 1
                },
                {
                    "label": "选项2",
                    "value": 2
                },
                {
                    "label": "选项3",
                    "value": 3
                }]
            },
            {
                "name": "ta1",
                "label": "多行文本",
                "outerWidth": 12,
                "labelWidth": 3,
                "contentWidth": 9,
                "widthInSteam": "auto",
                "type": "textarea",
                "rows": 3,
                "resize": "none",
                "placeholder": "请输入文本",
                "description": "请输入英文、数字、下划线"
            }],
            "rules": {
                "demo_text_J5IYWIDO_NZ22J6WFVPBM61Q53U1IKVS4I": {
                    "required": false,
                    "maxlength": 10,
                    "minlength": 5
                },
                "demo_select_J5IYWJ5R_A2A7V05OI9A7PJ6TKW66O5HFR": {
                    "required": false
                }
            },
            "values": {
                "t1": "测试文本框初值111111",
                "ta1": "测试多行文本初值测试多行文本初值测试多行文本初值测试多行文本初值测试多行文本初值测试多行文本初值测试多行文本初值测试多行文本初值测试多行文本初值测试多行文本初值测试多行文本初值测试多行文本初值测试多行文本初值测试多行文本初值测试多行文本初值测试多行文本初值测试多行文本初值测试多行文本初值测试多行文本初值测试多行文本初值测试多行文本初值",
                "s1": "1",
                "s2": ["2", "3"]
            },
            "isSteam": false,
            "isRead": false
        });
    }

    // 翻页后事件回调绑定
    myApp.onPageAfterAnimation(pt.url, function(pageData) {
        // 更新当前页码
        nowPageIndex = parseInt($$(pageData.container).attr('page-index'));
        // 临时解决multiselect的placeholder初始化问题
        $$(pageData.container).find('select[multiple]').change();
    });
});

// 提交方法
$$('.all-form-submit').on('click', function () {
    var formDatas = [];
    $$.each(pageTitles, function(idx){
        var formId = pageTitles[idx].url;
        if($$('form#' + formId).length == 1) {
            formDatas.push(myApp.formToData('#' + formId));
        }
    });
    myApp.alert(JSON.stringify(formDatas));
});

// 翻页方法
function bindPagerBtn() {
    $$('.page-prev').on('click', function () {
        var prevIndex = nowPageIndex - 1;
        if (prevIndex < 0) {
            // prevIndex = pageTitles.length - 1;
            myApp.alert('到达首页', '提示');
        } else {
            mainView.router.load({pageName: pageTitles[prevIndex].url});
        }
    });
    $$('.page-next').on('click', function () {
        var nextIndex = nowPageIndex + 1;
        if (nextIndex >= pageTitles.length) {
            // nextIndex = 0;
            // myApp.alert('到达末页', '提示');
            myApp.popup('.popup-submit');
        } else {
            mainView.router.load({pageName: pageTitles[nextIndex].url});
        }
    });    
}
bindPagerBtn();
