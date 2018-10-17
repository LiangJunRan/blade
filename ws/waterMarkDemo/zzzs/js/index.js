/*
js DOCUMENT
code by zhangxing 2017.11.18
*/

(function($){
    var width_=$(window).width();
    // 网站导航
    $(".li_hover").hover(function(){
        $(this).children(".ul_block").stop().slideToggle();
    })
    $(".router_detail").hide();
    $(".w_cont").hide().first().show();
    $(".u_line li").click(function(){
        $(".u_line li").removeClass("active");
        $(this).addClass("active")
        
        $(".w_cont").hide().eq($(this).index()).show();
    })
    $(".m_router").click(function(){
        
        if($(this).find("b").attr("data-turn")=='true'){
            $(this).find("b").css({"background-position":"center bottom"})
            $(this).find("b").attr("data-turn","false")
        }else{
            $(this).find("b").css({"background-position":"center top"}) 
            $(this).find("b").attr("data-turn","true")           
        }
        $(this).next(".router_detail").stop().slideToggle();
        
    })

    // 返回头部
    var goto_html='<div id="gotoTop"><span></span></div>';
    $("body").append(goto_html);
    var min_height=400;
    $("#gotoTop").click(function(){
        $("html,body").animate({scrollTop:0},700)
    }).hover(function(){
        $(this).addClass("hover")
    },function(){
        $(this).removeClass("hover")
    })

    $(window).scroll(function(){
        var s=$(window).scrollTop();
        if(s>min_height){
            // alert("a")
           $("#gotoTop").fadeIn(100)
        }else{
            $("#gotoTop").fadeOut(200)
        }
    
    })

    if(width_<1100){

    }else{
        $(document).click(function(e){
            var e = e || window.event; //浏览器兼容性   
            var elem = e.target || e.srcElement;  
            while (elem) { //循环判断至跟节点，防止点击的是div子元素   
                if (elem.id == 'test'||elem.id=='ys-search') {  
                    return;  
                }  
                elem = elem.parentNode;  
            }
            $(".search-ico,.nav_cont").show();
            $(".ys-search").hide();
           
        })
    }

  

})(window.jQuery)






/* 课程 */
// http://bj.xdf.cn/school/studyAbroadjsonp?categoryCode=414&one=34&two=49&size=5
// http://bj.xdf.cn/school/categoryClassjsonp?categoryCode=414&one=34&two=49&size=5
// http://bj.xdf.cn/school/studyAbroadjsonp?categoryCode=414&one=36&two=60&size=20
// http://bj.xdf.cn/school/categoryClassjsonp?categoryCode=414&one=35&counts=5
function classCourse(id,dom){
    $.ajax({
        type:'get',
        url:"http://bj.xdf.cn/school/categoryClassjsonp?categoryCode=414&one="+id+"&counts=5",
        dataType:"jsonp",
        jsonp: "callback",
        // jsonpCallback:"studyAbroadjsonp",
        success:function(data){
            var classCode=data;
            var detail='';
            var now_date=new Date().Format("yyyy-MM-dd");
            now_p_date=parseInt(now_date.replace(/-/g,''),10);

            for(var i=0;i<classCode.length;i++){
                if(parseInt(classCode[i].startdate.substr(0,10).replace(/-/g,''),10)<now_p_date){
                    continue;
                }
                detail+='<tr><td>'+classCode[i].classname+'</td><td class="td_hide">'+classCode[i].classtimes+'次课</td><td class="price">￥'+classCode[i].price+'起</td><td class="td_hide">'+classCode[i].startdate.substr(0,10)+' 至 '+classCode[i].enddate.substr(0,10)+'</td><td class="td_hide">'+classCode[i].address+'</td><td><a href="'+classCode[i].soukeline+'" target="_blank">报名</a></td></tr>'
            }
            var kong='<div class="kong">暂时没有相关信息</div>'
            // console.log(detail)
  
            if(detail!==''){
              $("#"+dom).prepend(detail)
              // console.log(detail)
            }else{
              $("#"+dom).parent().parent(".ul-demo").append(kong)
            }
         
        },error:function(){
            alert("网络异常")
        }
  
    })
  }

  Date.prototype.Format = function (fmt) { //author: meizz   
    var o = {  
        "M+": this.getMonth() + 1, //月份   
        "d+": this.getDate(), //日   
        "H+": this.getHours(), //小时   
        "m+": this.getMinutes(), //分   
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds() //毫秒   
    };  
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));  
    for (var k in o)  
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));  
    return fmt;  
}  

  classCourse(35,'t'+35)
  classCourse(34,'t'+34)

   /* 课程 */
  // http://bjzx.xdf.cn/school/studyAbroad?categoryCode=414&one=30&three=60&size=100
  
  
//   for(var i=37;i<=54;i++){
//     if(i==47){continue}
//     classCourse(i,'t'+i)
//   }
