'use strict';

computenzControllers.controller('ProfileCtrl', ['$scope','$http','$location','$routeParams','UserService','CacheService',function($scope,$http,$location,$routeParams,UserService,CacheService) {
  
  //if (typeof ($scope.user = CacheService.retrieveLastDisplay()) == "undefined") {
    var destination = decodeURIComponent(window.location.href.split('/').pop());
    if (destination == "myprofile") {
      $scope.user = UserService.getUser();
    }
    else {
      $scope.user = CacheService.getProfile(destination);
    }
  //}
  // CacheService.cacheLastDisplay($scope.user);

  $scope.edit = function(){
    $location.path('profile/edit/'+UserService.getUsername());
  };

}]);