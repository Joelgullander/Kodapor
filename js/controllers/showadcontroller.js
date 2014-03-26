'use strict';

computenzControllers.controller('ShowAdController', ['$scope','$http','$location','CacheService','MetaService', function($scope,$http,$location,CacheService,MetaService) {

  $scope.currentAd = CacheService.call('destination');
  $scope.categories = MetaService.convertCategories($scope.currentAd.categories);
  $scope.tags = MetaService.convertTags($scope.currentAd.tags);

  $scope.showIfExists = function(object,label){
    if (object != null) {
      return label + object;
    }
  };

  $scope.go = function(path){
    console.log("Path in showad go: ",path);
    $http({
      method: 'GET',
      url: 'php/rest.php' + path,
      headers : {
        'Content-Type' : 'application/json; charset=UTF-8'
      }
    }).success(function(data){
      CacheService.call('destination',data);
      $location.path(path);
    });
  };

}]);