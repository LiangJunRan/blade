// require的设置
if(typeof require_conf_run != 'object') (function () {
    var scriptEle = document.querySelectorAll("head > script");
    var baseUrl = scriptEle[scriptEle.length - 1].getAttribute("src").split('?')[0].replace(/\w+(\.\w+)*$/, 'require_lib');
    console.log('require baseUrl:', baseUrl);
    while(baseUrl.match(/\w+\/\.\.\//)) {
        baseUrl = baseUrl.replace(/\w+\/\.\.\//,'');
    }
    requirejs.config({
        nodeIdCompat: 0,
        waitSeconds: 0, //禁止超时
        baseUrl: baseUrl,
        map: {
            '*': {
                'css': 'css.min'
            }
        },
        paths: {
            'jQuery': 'jquery/jquery.min',
            'bootstrap': 'bootstrap/js/bootstrap.min',
            'test': 'test'
        },
        shim: {
            'bootstrap': {
                deps: [
                    'jQuery',
                    'css!../require_lib/bootstrap/css/bootstrap.min'
                ]
            }
        }
    });
    require_conf_run = {};
})();