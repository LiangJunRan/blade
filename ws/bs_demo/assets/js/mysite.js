$(function(){
　　$(".panel .fa-close").on("click", function(){
		console.log('clicked');
　　　　$(this).closest('.panel').remove();
　　});
});