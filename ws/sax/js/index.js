$(function(){
				$(window).scroll(function(){
					var gundong = $(window).scrollTop();
					var jvli = $('.bottom').offset().top-50;
					if(gundong >= jvli){
						$('.nav').addClass('cur')
					}else{
						$('.nav').removeClass('cur')
					}
				});
				
			});
