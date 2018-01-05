(function (b) {
    "function" == typeof define && define.amd ? define(['require', 'jQuery'], b) : window.MP3Encoder = b.apply(jQuery('head > script').last().attr('src'), jQuery, jQuery.jPlayer);
})(function (require, $) {
    var oReturn = {};/*模块返回值*/
    var busy = false;
    
    oReturn.isbusy = function(){
    	return busy;
    };
    
    oReturn.ready = function() {
        console.log('ready');
    };
    return oReturn;
});