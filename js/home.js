$(function(){

$(document).on("click",".circleL", function () {
  $( "#privat" ).slideUp( "slow", function() {
    // Animation complete.
  $( "#registration" ).slideDown( "slow", function() {
    // Animation complete.
  });
  });
});
});