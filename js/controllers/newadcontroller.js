'use strict';

/*************************************
*
*           Date controller
*
*************************************/

var DatepickerDemoCtrl = function ($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.showWeeks = true;
  $scope.toggleWeeks = function () {
    $scope.showWeeks = ! $scope.showWeeks;
  };

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = ( $scope.minDate ) ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event,which) {
    $event.preventDefault();
    $event.stopPropagation();
    if (which == 'pub')
      $scope.openedPub = true;
    else
      $scope.openedExp = true;
  };

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
  $scope.format = $scope.formats[1];
};

/*****************************************
*
*             Ad controller
*
*****************************************/

computenzControllers.controller('NewAdController',
	['$scope','$http','MetaService','UserService', function($scope,$http,MetaService,UserService ) {

  $scope.destination = decodeURIComponent(window.location.href.split('/').pop());

  $scope.ad = {};

  $scope.categories = MetaService.getCategories();
  $scope.tags = MetaService.getTags();
  $scope.selectedCategories = [];
  $scope.selectedTags = [];

  if ($scope.destination == 'editAd') {
    $http({
      method:'GET',
      url:'php/advertisement/' + $scope.destination
    }).success(function(data){
      $scope.ad = data;
    });
  }

  $scope.send = function(active) {
    $scope.ad.user_id = UserService.call('user_id');
    $scope.ad.active = active;
    $scope.ad.categories = (MetaService.convertCategories($scope.selectedCategories)).join(",");
    $scope.ad.tags = (MetaService.convertTags($scope.selectedTags)).join(",");
    console.log("In save: ", $scope.ad);
    $http({
      method: $scope.destination == 'editAd' ? 'PUT' : 'POST',
      url: 'php/rest.php/advertisement/' + $scope.ad.user_id,
      data: $scope.ad,
      headers : {
        'Content-Type' : 'application/json; charset=UTF-8'
      }
    });
  };

  $(document).on('click', '.catcloud', function(){
    var index = $(this).parent().children().index(this);
    $scope.selectedCategories.splice(index,1);
    $(this).remove();
  });

  $(document).on('click','.tagcloud', function(){
    var index = $(this).parent().children().index(this);
    $scope.selectedTags.splice(index,1);
    $(this).remove();
  });

}]);