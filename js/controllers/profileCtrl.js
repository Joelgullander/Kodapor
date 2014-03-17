'use strict';

computenzControllers.controller('ProfileCtrl', ['$scope','$http','$location','$routeParams','UserService','CacheService',function($scope,$http,$location,$routeParams,UserService,CacheService) {
  

  var destination = decodeURIComponent(window.location.href.split('/').pop());
  if (destination == "myprofile") {
    $scope.user = UserService.getUser();
  }
  else {
    $scope.user = CacheService.getProfile(destination);
  }

  CacheService.cacheDestination($scope.user);

  $http({
    method: 'GET',
    url: 'php/rest.php/meta_user/' + $scope.user.username,
    headers : {
      'Content-Type' : 'application/json; charset=UTF-8'
    }
  }).success(function(data){
    console.log(data);
    $scope.categories = data.categories;
    $scope.tags = data.tags;
  });

  $scope.edit = function(){
    $location.path('profile/edit/'+UserService.getUsername());
  };

}]);