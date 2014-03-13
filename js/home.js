
$(function(){
$(document).on("click",".flip", function () {
        $(this).find('.card').addClass('flipped').mouseleave(function(){
            $(this).removeClass('flipped');
        });
        return false;
    });
});