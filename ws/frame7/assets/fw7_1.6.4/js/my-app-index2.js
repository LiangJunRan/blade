// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;

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
    var $page = $$(pageTemplate).attr('data-page', pt.url)
            .attr('page-index', idx).addClass('cached');

    // TODO: 初始化页面详细过程
    if (idx != 0) {
        $$('.pages').append($page);
    }

    // 翻页后事件回调绑定
    myApp.onPageAfterAnimation(pt.url, function(pageData) {
        // 更新当前页码
        nowPageIndex = parseInt($$(pageData.container).attr('page-index'));
    });
});

// 翻页方法
function bindPagerBtn() {
    $$('.page-prev').on('click', function () {
        var prevIndex = nowPageIndex - 1;
        if (prevIndex < 0) {
            prevIndex = pageTitles.length - 1;
        }
        mainView.router.load({pageName: pageTitles[prevIndex].url});
    });
    $$('.page-next').on('click', function () {
        var nextIndex = nowPageIndex + 1;
        if (nextIndex >= pageTitles.length) {
            nextIndex = 0;
        }
        mainView.router.load({pageName: pageTitles[nextIndex].url});
    });    
}
bindPagerBtn();
