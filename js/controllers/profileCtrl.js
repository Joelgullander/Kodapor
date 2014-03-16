'use strict';

computenzControllers.controller('ProfileCtrl', ['$scope','$http','$location','$routeParams','UserService','CacheService',function($scope,$http,$location,$routeParams,UserService,CacheService) {
  

  var destination = decodeURIComponent(window.location.href.split('/').pop());
  if (destination == "myprofile") {
    $scope.user = UserService.getUser();
    console.log($scope.user);
  }
  else {
    $scope.user = CacheService.getProfile(destination);
  }


  $scope.edit = function(){
    $location.path('profile/edit/'+UserService.getUsername());
  };

}]);